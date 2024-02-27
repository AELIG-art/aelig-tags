import React from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTags } from "../../contexts/TagsContext";

const TagsList = () => {
    const { tags } = useTags();

    console.log(tags);

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
                                    return <Link to={`/tag/${tag.id}`}>SHOW</Link>
                                }
                                if (tag.metadata) {
                                    return <Link to={`/tag/${tag.id}`}>CONFIRM</Link>
                                }
                                return <Link to={`/tag/${tag.id}`}>ADD METADATA</Link>
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
