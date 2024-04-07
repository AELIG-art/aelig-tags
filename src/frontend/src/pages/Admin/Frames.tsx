import React, { useEffect, useState } from "react";
import { TagExpanded } from "../../utils/types";
import {Tag} from "../../declarations/backend/backend.did";
import {backend} from "../../declarations/backend";
import Button from "../../components/Button/Button";
import Table from "../../components/Table/Table";

const Frames = (props: {
    tagsSub: string,
    openModal: () => void
}) => {
    const {  tagsSub, openModal } = props;
    const [tagsExpanded, setTagsExpanded] = useState([] as TagExpanded[]);

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
        <Table headers={["#", "Id"]}>
            {
                tagsExpanded.map((tag) => {
                    return <tr key={tag.id}>
                        <td>{tag.short_id}</td>
                        <td>{tag.id.toString(16)}</td>
                    </tr>
                })
            }
        </Table>
    </div>;
}

export default Frames;
