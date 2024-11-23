import React, {useEffect, useState} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TagExpanded } from "../../utils/types";
import "./styles.Tag.css";
import {useSiweIdentity} from "ic-use-siwe-identity";
import {useBackendActor} from "../../contexts/BackendActorContext";
import {GetTagResult} from "../../declarations/backend/backend.did";
import Certificate from "./Certificate";
import Frame from "./Frame";

type ContentProps = {
    isCertificate: boolean;
    id: string;
}

const Content = ({isCertificate, id}: ContentProps) => isCertificate ? <Certificate
    tagId={id!}
/> : <Frame
    tagId={id!}
/>;

const Tag = () => {
    let { id } = useParams();
    const {backendActor} = useBackendActor();
    const navigate = useNavigate();
    const { isInitializing, identityAddress } = useSiweIdentity();
    const [isLoading, setIsLoading] = useState(true);

    const [tag, setTag] = useState<undefined|TagExpanded>();
    const [isCertificate, setIsCertificate] = useState(false);

    useEffect(() => {
        if (identityAddress === undefined && !isInitializing) {
            navigate("/");
        }
        if (id && identityAddress && backendActor) {
            backendActor.get_tag(id).then((tagRes) => {
                const tagResTyped = tagRes as GetTagResult;
                if ('Ok' in tagResTyped) {
                    if (tagResTyped.Ok.owner === identityAddress) {
                        setIsCertificate(tagResTyped.Ok.is_certificate);
                        setTag(tagResTyped.Ok);
                        setIsLoading(false);
                    } else {
                        navigate("/");
                    }
                } else {
                    navigate("/");
                }
            });
        }
    }, [id, identityAddress, isInitializing, navigate, backendActor]);

    return <div className={"pb-3"}>
        <h1 className="mt-5">{tag?.short_id || tag?.id}</h1>
        <Link to={isCertificate ? "/" : "/#frames"} className="back">Back</Link>
        {!isLoading && <Content isCertificate={isCertificate} id={id!}/>}
    </div>;
}

export default Tag;
