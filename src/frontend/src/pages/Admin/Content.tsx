import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { TagExpanded } from "../../utils/types";
import MetadataModal from "./MetadataModal";
import {NFTMetadata, Tag} from "../../declarations/backend/backend.did";
import {backend} from "../../declarations/backend";

const Content = (props: {
    isAdmin: boolean,
    tagsSub: string,
}) => {
    const { isAdmin, tagsSub } = props;
    const [tagsExpanded, setTagsExpanded] = useState([] as TagExpanded[]);
    const [metadataModalOpen, setMetadataModalOpen] = useState(false);
    const [
        metadata,
        setMetadata
    ] = useState(undefined as undefined|NFTMetadata);

    useEffect(() => {
        backend.get_tags().then((tags: Tag[]) => {
            const tagsExpanded: Promise<TagExpanded[]> = Promise.all(
                tags.filter((tag: Tag) => tag.is_certificate)
                    .map(async (tag: Tag) => {
                        const certificate = await backend.get_certificate(tag.id.toString(16));
                        if ("Ok" in certificate) {
                            const expanded: TagExpanded = tag;
                            expanded.metadata = certificate.Ok.metadata;
                            expanded.registered = certificate.Ok.registered;
                            return expanded;
                        } else {
                            return tag as TagExpanded;
                        }
                    })
            );
            tagsExpanded.then((res) => {
                setTagsExpanded(res);
            });
        });
    }, [tagsSub]);

    if (isAdmin) {
        return <div className={'mt-3'}>
            <h1>Tags list</h1>
            <Table striped bordered hover className={"mt-3"}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Id</th>
                        <th>Owner</th>
                        <th>Registered</th>
                        <th>Metadata</th>
                    </tr>
                </thead>
                <tbody>
                {
                    tagsExpanded.map((tag) => {
                        return <tr key={tag.id}>
                            <td>{tag.short_id}</td>
                            <td>{tag.id.toString(16)}</td>
                            <td>{tag.owner || 'not assigned'}</td>
                            <td>{tag.registered ? "Yes" : 'NO'}</td>
                            <td>
                                {
                                    tag.metadata ? <Button
                                        size={'sm'}
                                        variant={'link'}
                                        onClick={() => {
                                            setMetadata(tag.metadata);
                                            setMetadataModalOpen(true);
                                        }}
                                    >
                                        View
                                    </Button> : 'No'
                                }
                            </td>
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
    else {
        return <div className={"mt-5 text-center"}>
            <p>You are not an admin. Please, login with another account.</p>
        </div>
    }
}

export default Content;
