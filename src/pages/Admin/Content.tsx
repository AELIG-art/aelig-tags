import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { Metadata, TagExpanded } from "../../utils/types";
import { listDocs } from "@junobuild/core";
import MetadataModal from "./MetadataModal";

const Content = (props: {
    isAdmin: boolean
}) => {
    const { isAdmin } = props;
    const [tagsExpanded, setTagsExpanded] = useState([] as TagExpanded[]);
    const [metadataModalOpen, setMetadataModalOpen] = useState(false);
    const [
        metadata,
        setMetadata
    ] = useState(undefined as undefined|Metadata);

    useEffect(() => {
        listDocs({
            collection: 'tags'
        }).then((res) => {
            const tagsPerUser = res.items as unknown as [{data: TagExpanded[]}];
            let tags = [] as TagExpanded[];
            tagsPerUser.forEach((tag) => {
                tags = tags.concat(tag.data);
            });
            listDocs({
                collection: 'metadata'
            }).then((res) => {
                const items = res.items as unknown as {key: string, data: Metadata}[];
                const metadataDict: { [key: string]: Metadata } = items.reduce((
                    acc: { [key: string]: Metadata },
                    { key, data }
                ) => {
                    acc[key] = data;
                    return acc;
                }, {});
                tags.forEach((tag) => {
                   tag.metadata = metadataDict[tag.id];
                });
                setTagsExpanded(tags);
                console.log(tags);
            });
        });
    }, []);

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
                            <td>{tag.shortId}</td>
                            <td>{tag.id}</td>
                            <td>{tag.metadata?.author || 'not assigned'}</td>
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
