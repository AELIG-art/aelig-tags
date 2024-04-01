import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {backend} from "../../declarations/backend";
import Success from "./Success";
import Error from "./Error";

const Verify = () => {
    const { msg } = useParams();
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (msg) {
            backend.verify_tag(msg).then((res) => {
                setIsValid("OK" in res);
                setIsLoading(false);
            });
        }
    }, [msg, setIsValid, setIsLoading]);

    if (isLoading) {
        return null;
    } else {
        return isValid ? <Success /> : <Error />
    }
}

export default Verify;