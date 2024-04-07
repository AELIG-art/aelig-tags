import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {MediaRenderer, useAddress, useConnectionStatus} from "@thirdweb-dev/react";
import {backend} from "../../declarations/backend";
import {TagExpanded} from "../../utils/types";
import {SnackbarProvider} from "notistack";
import "./styles.tag.css";
import MetadataForm from "./MetadataForm";
import MetadataInfo from "./MetadataInfo";

const Tag = () => {
    let { id } = useParams();

    const [tag, setTag] = useState<undefined|TagExpanded>();
    const [subscription, setSubscription] = useState("");

    const [name, setName] = useState<undefined|string>();
    const [description, setDescription] = useState<undefined|string>();
    const [image, setImage] = useState<undefined|string>();
    const [isLoading, setIsLoading] = useState(true);

    const [
        certificateRegistered,
        setCertificateRegistered
    ] = useState(true);

    const connectionStatus = useConnectionStatus();
    const navigate = useNavigate();
    const address = useAddress();


    useEffect(() => {
        if (connectionStatus === "disconnected") {
            navigate("/");
        }
        if (id && address) {
            backend.get_tag(id).then((tagRes) => {
                if ('Ok' in tagRes) {
                    if (tagRes.Ok.owner === address) {
                        backend.get_certificate(id!).then((certificateRes) => {
                            if ('Ok' in certificateRes) {
                                setTag({
                                    ...tagRes.Ok,
                                    registered: certificateRes.Ok.registered,
                                    metadata: certificateRes.Ok.metadata.length > 0 ? certificateRes.Ok.metadata[0]
                                        : undefined
                                });
                                if (certificateRes.Ok.metadata.length > 0) {
                                    setName(certificateRes.Ok.metadata[0]!.name);
                                    setDescription(certificateRes.Ok.metadata[0]!.description);
                                    setImage(certificateRes.Ok.metadata[0]!.image);
                                }
                                setIsLoading(false);
                            } else {
                                navigate("/");
                            }
                        });
                    } else {
                        navigate("/");
                    }
                } else {
                    navigate("/");
                }
            });
        }
    }, [id, address, connectionStatus, subscription]);

    return <div>
        <h1 className="mt-5">{tag?.short_id || tag?.id.toString(16)}</h1>
        <Link to={"/"} className="back">Back</Link>
        {
            !isLoading ? <div className={"row mt-4"}>
                <div className={"col-6"}>
                    <div className={"d-flex w-100 h-100"}>
                        {
                            image ? <MediaRenderer src={image} alt="Certificate" className={"w-100 h-100"}/> : null
                        }
                    </div>
                </div>
                <div className={"col-6"}>
                    {
                        !certificateRegistered ? <MetadataForm
                            tag={tag}
                            id={id}
                            setCertificateRegistered={setCertificateRegistered}
                            setSubscription={setSubscription}
                            name={name}
                            setName={setName}
                            description={description}
                            setDescription={setDescription}
                            image={image}
                            setImage={setImage}
                        /> : <MetadataInfo name={name} description={description} />
                    }
                </div>
            </div> : <p className="mt-4">Loading…</p>
        }
        <SnackbarProvider />
    </div>;
}

export default Tag;
