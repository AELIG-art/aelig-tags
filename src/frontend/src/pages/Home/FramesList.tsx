import {useTags} from "../../contexts/TagsContext";
import React from "react";
import Table from "../../components/Table/Table";
import {Frame} from "../../declarations/backend/backend.did";
import {Link} from "react-router-dom";

const CertificatesList = () => {
    const { frames } = useTags();

    return <div>
        <h1 className={"mt-5"}>Your Frames</h1>
        <Table
            headers={["#", "Action"]}
        >
            {
                frames.map((frame: Frame, index: number) => {
                    return <tr key={index}>
                        <td>{frame.id}</td>
                        <td>
                            <Link
                                to={`/tag/${frame.id}`}
                                className="link"
                            >
                                OPEN
                            </Link>
                        </td>
                    </tr>
                })
            }
        </Table>
    </div>;
}

export default CertificatesList