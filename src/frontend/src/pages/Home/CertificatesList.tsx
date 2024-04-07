import React from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTags } from "../../contexts/TagsContext";
import {intToHexId} from "../../utils/transformations";
import "./styles.CertificatesList.css";

const CertificatesList = () => {
    const { tags } = useTags();

    return <div>
        <h1 className={"mt-5"}>Your certificates</h1>
        <Table className={"mt-4"}>
            <thead>
            <tr>
                <th className="header">#</th>
                <th className="header">Id</th>
                <th className="header">Metadata created</th>
                <th className="header">Registered</th>
                <th className="header">Action</th>
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
                            <Link
                                to={`/tag/${intToHexId(Number(tag.id))}`}
                                className="link"
                            >
                                {
                                    (() => {
                                       if (tag.registered) {
                                           return "OPEN";
                                       } else if (tag.metadata) {
                                           return "REGISTER";
                                       } else {
                                           return "ADD METADATA";
                                       }
                                    })()
                                }
                            </Link>
                        </td>
                    </tr>
                })
            }
            </tbody>
        </Table>
    </div>;
}

export default CertificatesList;
