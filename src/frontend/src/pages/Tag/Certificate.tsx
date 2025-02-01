import {useEffect, useState} from "react";
import MetadataForm from "./MetadataForm";
import {SupportedChain, TagExpanded} from "../../utils/types";
import MetadataInfo from "./MetadataInfo";
import {GetCertificateResult, GetTagResult} from "../../declarations/backend/backend.did";
import {useBackendActor} from "../../contexts/BackendActorContext";
import {useNavigate} from "react-router-dom";
import Loading from "./Loading";

type Props = {
    tagId: string;
}

const Certificate = ({tagId}: Props) => {
    const {backendActor} = useBackendActor();
    const navigate = useNavigate();

    const [tag, setTag] = useState<undefined|TagExpanded>();
    const [name, setName] = useState<undefined|string>();
    const [description, setDescription] = useState<undefined|string>();
    const [chain, setChain] = useState<undefined|SupportedChain>();
    const [address, setAddress] = useState<undefined|string>();
    const [nftId, setNftId] = useState<undefined|string>();
    const [image, setImage] = useState<undefined|string>();
    const [isLoading, setIsLoading] = useState(true);
    const [subscription, setSubscription] = useState("");
    const [
        certificateRegistered,
        setCertificateRegistered
    ] = useState(false);

    useEffect(() => {
        if (backendActor) {
            backendActor.get_tag(tagId).then((tagRes) => {
                const tagResTyped = tagRes as GetTagResult;
                if ("Ok" in tagResTyped) {
                    backendActor.get_certificate(tagId).then((certificateRes) => {
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
                            if (certificateResTyped.Ok.nft_details.length > 0) {
                                setChain(certificateResTyped.Ok.nft_details[0]!.chain as SupportedChain);
                                setAddress(certificateResTyped.Ok.nft_details[0]!.address);
                                setNftId(certificateResTyped.Ok.nft_details[0]!.id);
                            }
                            setIsLoading(false);
                        } else {
                            navigate("/");
                        }
                    });
                } else {
                    navigate("/");
                }
            });
        }
    }, [backendActor, navigate, tagId, subscription]);


    return !isLoading ? <div className={"row mt-4"}>
        <div className={"col-6"}>
            <div className={`d-flex w-100 h-100 ${!image ? "border" : ""}`}>
                {
                    image ? <img
                        src={image}
                        alt="Certificate"
                        className={"w-100 h-100"}
                    /> : null
                }
            </div>
        </div>
        <div className={"col-6"}>
            {
                !certificateRegistered ? <MetadataForm
                    tag={tag}
                    id={tagId}
                    setCertificateRegistered={setCertificateRegistered}
                    setSubscription={setSubscription}
                    name={name}
                    setName={setName}
                    description={description}
                    chain={chain}
                    address={address}
                    nftId={nftId}
                    setDescription={setDescription}
                    image={image}
                    setImage={setImage}
                    setChain={setChain}
                    setAddress={setAddress}
                    setNftId={setNftId}
                /> : <MetadataInfo name={name} description={description} />
            }
        </div>
    </div> : <Loading />
}

export default Certificate;