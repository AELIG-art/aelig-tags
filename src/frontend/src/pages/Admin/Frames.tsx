import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { TagExpanded } from "../../utils/types";
import MetadataModal from "./MetadataModal";
import {NFTMetadata, Tag} from "../../declarations/backend/backend.did";
import {backend} from "../../declarations/backend";

const Frames = (props: {
    tagsSub: string,
    openModal: () => void
}) => {
    const {  tagsSub, openModal } = props;
    const [tagsExpanded, setTagsExpanded] = useState([] as TagExpanded[]);
    const [metadataModalOpen, setMetadataModalOpen] = useState(false);
    const [
        metadata,
        setMetadata
    ] = useState(undefined as undefined|NFTMetadata);

    useEffect(() => {
        backend.get_tags().then((tags: Tag[]) => {
            const tagsExpanded: Promise<TagExpanded[]> = Promise.all(
                tags.filter((tag: Tag) => !tag.is_certificate)
                    .map(async (tag: Tag) => {
                        // todo: get frame from tag
                        /*const frame = await backend.get_certificate(tag.id.toString(16));
                        if ("Ok" in certificate) {
                            const expanded: TagExpanded = tag;
                            expanded.metadata = certificate.Ok.metadata;
                            expanded.registered = certificate.Ok.registered;
                            return expanded;
                        } else {
                            return tag as TagExpanded;
                        }*/
                        return tag as TagExpanded;
                    })
            );
            tagsExpanded.then((res) => {
                setTagsExpanded(res);
            });
        });
    }, [tagsSub]);

    return <div className={'mt-3'}>
        <Button
            onClick={openModal}
        >
            Register new tag
        </Button>
        <Table striped bordered hover className={"mt-3"}>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Id</th>
                    <th>Owner</th>
                    <th>NFT</th>
                </tr>
            </thead>
            <tbody>
            {
                tagsExpanded.map((tag) => {
                    return <tr key={tag.id}>
                        <td>{tag.short_id}</td>
                        <td>{tag.id.toString(16)}</td>
                        <td>{tag.owner || 'not assigned'}</td>
                        {/* todo: compose opensea link or add text if NFT is not connected */}
                        <td><a target="_blank" href={`https://opensea.io`}>Opensea ↗</a></td>
                    </tr>
                })
            }
            </tbody>
        </Table>
        <MetadataModal
            open={metadataModalOpen}
            close={() => setMetadataModalOpen(false)}
            metadata={metadata}
        />
    </div>;
}

export default Frames;
