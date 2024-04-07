import React from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTags } from "../../contexts/TagsContext";
import {intToHexId} from "../../utils/conversions";

const CertificatesList = () => {
    const { tags } = useTags();

    return <div>
        <h1>Your certificates</h1>
        <Table striped bordered hover className={"mt-3"}>
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
                        <td>{tag.short_id}</td>
                        <td>{intToHexId(Number(tag.id))}</td>
                        <td>{tag.metadata ? 'YES' : 'NO'}</td>
                        <td>{tag.registered ? 'YES' : 'NO'}</td>
                        <td>
                            <Link to={`/tag/${intToHexId(Number(tag.id))}`}>OPEN</Link>
                        </td>
                    </tr>
                })
            }
            </tbody>
        </Table>
    </div>;
}

export default CertificatesList;
