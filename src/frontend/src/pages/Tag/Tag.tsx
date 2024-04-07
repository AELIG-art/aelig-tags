import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import {MediaRenderer, useAddress, useConnectionStatus, useSigner, useStorageUpload} from "@thirdweb-dev/react";
import {NFTMetadata} from "../../declarations/backend/backend.did";
import {backend} from "../../declarations/backend";
import {TagExpanded} from "../../utils/types";
import {enqueueSnackbar, SnackbarProvider} from "notistack";
import {useTags} from "../../contexts/TagsContext";

const Tag = () => {
    let { id } = useParams();
    const [tag, setTag] = useState<undefined|TagExpanded>();
    const { setSub } = useTags();

    const [name, setName] = useState<undefined|string>();
    const [description, setDescription] = useState<undefined|string>();
    const { mutateAsync: upload} = useStorageUpload();
    const inputRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<undefined|string>();
    const [isLoading, setIsLoading] = useState(true);
    const [dataUpdated, setDataUpdated] = useState(false);
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const [isDataMissing, setIsDataMissing] = useState(true);
    const [buttonText, setButtonText] = useState("");
    const [
        certificateRegistered,
        setCertificateRegistered
    ] = useState(true);
    const [
        buttonAction,
        setButtonAction
    ] = useState("save" as "save"|"register");

    const signer = useSigner();
    const address = useAddress();
    const navigate = useNavigate();
    const connectionStatus = useConnectionStatus();
    const [subscription, setSubscription] = useState("");

    useEffect(() => {
        setIsDataMissing(!image || image === "" || !name || name === "" || !description || description === "");
    }, [image, name, description]);

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

    useEffect(() => {
        if (tag) {
            if (!tag.registered) {
                setCertificateRegistered(false);
                if (isLoadingButton) {
                    setButtonText("Updating…");
                } else {
                    if (dataUpdated || isDataMissing) {
                        setButtonText("Save");
                        setButtonAction("save");
                    } else {
                        setButtonText("Register");
                        setButtonAction("register");
                    }
                }
            } else {
                setCertificateRegistered(true);
            }
        }
    }, [tag, dataUpdated, isLoadingButton]);

    return <div>
        <h1>{tag?.short_id || tag?.id.toString(16)}</h1>
        <Link to={"/"}>Back</Link>
        {
            !isLoading ? <div className={"row mt-3"}>
                <div className={"col-6"}>
                    <div className={"d-flex w-100 h-100 border rounded"}>
                        {
                            image ? <MediaRenderer src={image} alt="Certificate" className={"w-100 h-100"}/> : null
                        }
                    </div>
                </div>
                <div className={"col-6"}>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Name"
                                value={name || tag?.metadata?.name || ""}
                                onChange={(event) => {
                                    setName(event.target.value);
                                    setDataUpdated(true);
                                }}
                                disabled={certificateRegistered}
                            />
                            <Form.Text className="text-muted">
                                The name of the certificate.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                as="textarea"
                                rows={10}
                                placeholder="Description"
                                value={description || tag?.metadata?.description || ""}
                                onChange={(event) => {
                                    setDescription(event.target.value);
                                    setDataUpdated(true);
                                }}
                                disabled={certificateRegistered}
                            />
                            <Form.Text className="text-muted">
                                The description of the certificate.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                ref={inputRef}
                                accept="image/*,video/*"
                                onChange={() => {
                                    if (inputRef.current?.files) {
                                        const file = inputRef.current.files[0];
                                        upload({data: [file]}).then((res) => {
                                            setImage(res[0]);
                                            setDataUpdated(true);
                                        });
                                    }
                                }}
                                disabled={certificateRegistered}
                            />
                            <Form.Text className="text-muted">
                                The image of the certificate.
                            </Form.Text>
                        </Form.Group>
                    </Form>
                    <div className={"d-flex flex-row-reverse"}>
                        {
                            !certificateRegistered && signer && tag && id && address ? <Button
                                variant="primary"
                                disabled={isLoadingButton || isDataMissing}
                                onClick={() => {
                                    setIsLoadingButton(true);
                                    if (signer && tag && id && address) {
                                        const messageJson = {
                                            name: name || tag?.metadata?.name || "",
                                            description: description || tag?.metadata?.description || "",
                                            image: image || tag?.metadata?.image || "",
                                            attributes: [],
                                            id: id
                                        }
                                        signer.signMessage(JSON.stringify(messageJson))
                                            .then((signature) => {
                                                if (buttonAction === 'save') {
                                                    const metadata = {
                                                        name: name || tag?.metadata?.name || "",
                                                        description: description || tag?.metadata?.description || "",
                                                        image: image || tag?.metadata?.image || "",
                                                        attributes: []
                                                    } as NFTMetadata;
                                                    backend.save_certificate(
                                                        id!,
                                                        metadata,
                                                        signature
                                                    ).then((res) => {
                                                        setDataUpdated(false);
                                                        if ("Ok" in res) {
                                                            enqueueSnackbar(
                                                                'Success',
                                                                {
                                                                    variant: 'success',
                                                                    persist: false,
                                                                    preventDuplicate: true,
                                                                    transitionDuration: 3
                                                                }
                                                            );
                                                            setSub(new Date().toISOString());
                                                            setSubscription(new Date().toISOString());
                                                        } else {
                                                            enqueueSnackbar(
                                                                res.Err.toString(),
                                                                {
                                                                    variant: 'error',
                                                                    persist: false,
                                                                    preventDuplicate: true,
                                                                    transitionDuration: 3
                                                                }
                                                            );
                                                        }
                                                        setIsLoadingButton(false);
                                                    });
                                            } else {
                                                signer.signMessage(JSON.stringify(messageJson))
                                                    .then((signature) => {
                                                        backend.register_certificate(
                                                            id!,
                                                            signature
                                                        ).then((res) => {
                                                            if ("Ok" in res) {
                                                                enqueueSnackbar(
                                                                    'Success',
                                                                    {
                                                                        variant: 'success',
                                                                        persist: false,
                                                                        preventDuplicate: true,
                                                                        transitionDuration: 3
                                                                    }
                                                                );
                                                                setCertificateRegistered(true);
                                                                setSubscription(new Date().toISOString());
                                                                setSub(new Date().toISOString());
                                                            } else {
                                                                enqueueSnackbar(
                                                                    res.Err.toString(),
                                                                    {
                                                                        variant: 'error',
                                                                        persist: false,
                                                                        preventDuplicate: true,
                                                                        transitionDuration: 3
                                                                    }
                                                                );
                                                            }
                                                            setIsLoadingButton(false);
                                                        });
                                                });
                                            }
                                        });
                                    }
                                }}
                            >
                                {buttonText}
                            </Button> : null
                        }
                    </div>
                </div>
            </div> : <p>Loading…</p>
        }
        <SnackbarProvider />
    </div>;
}

export default Tag;
