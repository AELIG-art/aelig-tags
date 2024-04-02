import React, {useEffect, useState} from "react";
import {Certificate, Frame } from "../../declarations/backend/backend.did";
import {MediaRenderer} from "@thirdweb-dev/react";

const Success = (props: {
    tagContent: undefined|{ Frame: Frame }|{ Certificate: Certificate }
}) => {
    const {tagContent} = props;
    const [isCertificate, setIsCertificate] = useState(false);
    const [
        content,
        setContent
    ] = useState<Frame|Certificate|undefined>(undefined);

    useEffect(() => {
        if (tagContent) {
            console.log(tagContent);
            setIsCertificate("Certificate" in tagContent);
            if ("Certificate" in tagContent) {
                setContent(tagContent.Certificate);
                console.log(tagContent.Certificate);
            } else {
                setContent(tagContent.Frame);
            }
        }
    }, [tagContent]);

    return <div className="container d-flex flex-column justify-content-center text-break">
        <div className="mt-3 mb-3">
            {
                isCertificate ? <div className={"row"}>
                    <div className="col-sm-8 col-md-6 col-lg-4 mx-auto p-3">
                        <MediaRenderer
                            src={(content as Certificate|undefined)?.metadata[0]!.image}
                            alt="Certificate"
                            className={"img-fluid w-100 h-100"}
                        />
                    </div>
                </div> : null
            }
        </div>
        <h2>{isCertificate ? "Certificate" : "Frame"}</h2>
        <h5>Name</h5>
        <p>{(content as Certificate|undefined)?.metadata[0]!.name}</p>
        <h5>Description</h5>
        <p>{(content as Certificate|undefined)?.metadata[0]!.description}</p>
    </div>;
}

export default Success;