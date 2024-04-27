import React from "react";
import { Link } from "react-router-dom";
import { useTags } from "../../contexts/TagsContext";
import {TagExpanded} from "../../utils/types";
import {intToHexId} from "../../utils/transformations";
import "./styles.CertificatesList.css";
import Table from "../../components/Table/Table";

const CertificatesList = () => {
    const { tags } = useTags();

    return <div>
        <h1 className={"mt-5"}>Your certificates</h1>
        <Table
            headers={["#", "Id", "Metadata created", "Registered", "Action"]}
        >
            {
                tags.map((tag: TagExpanded, index: number) => {
                    return <tr key={index}>
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
        </Table>
    </div>;
}

export default CertificatesList;
