import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {backend} from "../../declarations/backend";
import Success from "./Success";
import Error from "./Error";
import {Certificate, Frame } from "../../declarations/backend/backend.did";

const Verify = () => {
    const { msg } = useParams();
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [
        tagContent,
        setTagContent
    ] = useState<undefined|{ Frame: Frame }|{ Certificate: Certificate }>(undefined);

    useEffect(() => {
        if (msg && setIsValid && setIsLoading && setTagContent) {
            backend.verify_tag(msg).then((res) => {
                setIsValid("Ok" in res);
                setIsLoading(false);
                if ("Ok" in res) {
                    setTagContent(res.Ok);
                } else {
                    setTagContent(undefined);
                }
            });
        }
    }, [msg, setIsValid, setIsLoading, setTagContent]);

    if (isLoading) {
        return <p>Loading…</p>;
    } else {
        return isValid ? <Success tagContent={tagContent} /> : <Error />
    }
}

export default Verify;