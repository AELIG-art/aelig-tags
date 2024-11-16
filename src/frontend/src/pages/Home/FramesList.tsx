import {useTags} from "../../contexts/TagsContext";
import React from "react";
import Table from "../../components/Table/Table";
import {Frame} from "../../declarations/backend/backend.did";
import {Link} from "react-router-dom";
import {nftToOpenSeaUrl} from "../../utils/transformations";

const CertificatesList = () => {
    const { frames } = useTags();

    return <div>
        <h1 className={"mt-5"}>Your Frames</h1>
        <Table
            headers={["#", "Has NFT", "Link"]}
        >
            {
                frames.map((frame: Frame, index: number) => {
                    const nft = frame.nft.length === 1 ? frame.nft[0] : undefined;
                    return <tr key={index}>
                        <td>{frame.id}</td>
                        <td>{nft ? "Yes" : "No"}</td>
                        <td>
                            {
                                nft && <Link
                                    to={nftToOpenSeaUrl(nft)}
                                    target="_blank"
                                    className="link"
                                >
                                    See on OpenSea
                                </Link>
                            }
                        </td>
                    </tr>
                })
            }
        </Table>
    </div>;
}

export default CertificatesList