import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useAddress } from "@thirdweb-dev/react";
import { Metadata, Tag, TagExpanded } from "../../utils/types";
import { getDoc } from "@junobuild/core";
import { Link } from "react-router-dom";

const TagsList = () => {
    const address = useAddress();
    const [tags, setTags] = useState([] as TagExpanded[]);

    const getTagsExpanded = async (address: string) => {
        const tagsRes = await getDoc({
            collection: 'tags',
            key: address
        });
        if (tagsRes === undefined) {
            return [];
        } else {
            const tags: TagExpanded[] = [];

            for (const tag of (tagsRes.data as Tag[])) {
                if (tag.registered) {
                    const metadataRes = await getDoc({
                        collection: 'metadata',
                        key: tag.id.toString()
                    });
                    if (metadataRes) {
                        tags.push({
                            ...tag,
                            metadata: metadataRes.data as Metadata
                        });
                    } else {
                        tags.push(tag as TagExpanded);
                    }
                } else {
                    tags.push(tag as TagExpanded);
                }
            }

            return tags;
        }
    }

    useEffect(() => {
        if (address) {
            getTagsExpanded(address).then((tags) => {
                setTags(tags);
            });
        }
    }, [address]);

    return <div>
        <h1>Your tags</h1>
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>#</th>
                <th>Id</th>
                <th>Metadata created</th>
                <th>Registered</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {
                tags.map((tag) => {
                    return <tr>
                        <td>{tag.shortId}</td>
                        <td>{tag.id}</td>
                        <td>{tag.metadata ? 'YES' : 'NO'}</td>
                        <td>{tag.registered ? 'YES' : 'NO'}</td>
                        <td>{
                            (() => {
                                if (tag.registered) {
                                    return <Link to={`/${tag.id}`}>SHOW</Link>
                                }
                                if (tag.metadata) {
                                    return <Link to={`/${tag.id}`}>CONFIRM</Link>
                                }
                                return <Link to={`/${tag.id}`}>ADD METADATA</Link>
                            })()
                        }</td>
                    </tr>
                })
            }
            </tbody>
        </Table>
    </div>;
}

export default TagsList;
