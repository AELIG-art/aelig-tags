import React, {useEffect, useState} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TagExpanded } from "../../utils/types";
import "./styles.Tag.css";
import MetadataForm from "./MetadataForm";
import MetadataInfo from "./MetadataInfo";
import {useSiweIdentity} from "ic-use-siwe-identity";
import {useBackendActor} from "../../contexts/BackendActorContext";
import {GetCertificateResult, GetTagResult} from "../../declarations/backend/backend.did";

const Tag = () => {
    let { id } = useParams();

    const [tag, setTag] = useState<undefined|TagExpanded>();
    const [subscription, setSubscription] = useState("");

    const [name, setName] = useState<undefined|string>();
    const [description, setDescription] = useState<undefined|string>();
    const [image, setImage] = useState<undefined|string>();
    const [isLoading, setIsLoading] = useState(true);

    const {backendActor} = useBackendActor();

    const [
        certificateRegistered,
        setCertificateRegistered
    ] = useState(false);

    const navigate = useNavigate();
    const { isInitializing, identityAddress } = useSiweIdentity();

    useEffect(() => {
        if (identityAddress === undefined && !isInitializing) {
            navigate("/");
        }
        if (id && identityAddress && backendActor) {
            backendActor.get_tag(id).then((tagRes) => {
                const tagResTyped = tagRes as GetTagResult;
                if ('Ok' in tagResTyped) {
                    if (tagResTyped.Ok.owner === identityAddress) {
                        backendActor.get_certificate(id!).then((certificateRes) => {
                            const certificateResTyped = certificateRes as GetCertificateResult;
                            if ('Ok' in certificateResTyped) {
                                setTag({
                                    ...tagResTyped.Ok,
                                    registered: certificateResTyped.Ok.registered,
                                    metadata: certificateResTyped.Ok.metadata.length > 0 ? certificateResTyped.Ok.metadata[0]
                                        : undefined
                                });
                                if (certificateResTyped.Ok.metadata.length > 0) {
                                    setName(certificateResTyped.Ok.metadata[0]!.name);
                                    setDescription(certificateResTyped.Ok.metadata[0]!.description);
                                    setImage(certificateResTyped.Ok.metadata[0]!.image);
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
    }, [id, identityAddress, isInitializing, subscription, navigate, backendActor]);

    return <div className={"pb-3"}>
        <h1 className="mt-5">{tag?.short_id || tag?.id}</h1>
        <Link to={"/"} className="back">Back</Link>
        {
            !isLoading ? <div className={"row mt-4"}>
                <div className={"col-6"}>
                    <div className={`d-flex w-100 h-100 ${!image ? "border" : ""}`}>
                        {
                            image ? <img
                                src={image}
                                alt="Certificate Image"
                                className={"w-100 h-100"}
                            /> : null
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
    </div>;
}

export default Tag;
