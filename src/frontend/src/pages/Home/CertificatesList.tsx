import React from "react";
import { Link } from "react-router-dom";
import { useTags } from "../../contexts/TagsContext";
import "./styles.CertificatesList.css";
import Table from "../../components/Table/Table";
import {Certificate} from "../../declarations/backend/backend.did";

const CertificatesList = () => {
    const { certificates } = useTags();

    return <div>
        <h1 className={"mt-5"}>Your certificates</h1>
        <Table
            headers={["#", "Id", "Metadata created", "Registered", "Action"]}
        >
            {
                certificates.map((certificate: Certificate, index: number) => {
                    return <tr key={index}>
                        <td>{certificate.short_id}</td>
                        <td>{certificate.id}</td>
                        <td>{certificate.metadata ? 'YES' : 'NO'}</td>
                        <td>{certificate.registered ? 'YES' : 'NO'}</td>
                        <td>
                            <Link
                                to={`/tag/${certificate.id}`}
                                className="link"
                            >
                                {
                                    (() => {
                                       if (certificate.registered) {
                                           return "OPEN";
                                       } else if (certificate.metadata.length > 0) {
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
        </Table>
    </div>;
}

export default CertificatesList;
