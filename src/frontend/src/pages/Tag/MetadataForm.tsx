import React, {useEffect, useRef, useState} from "react";
import {Form} from "react-bootstrap";
import {NFTMetadata, UpdateResult} from "../../declarations/backend/backend.did";
import {backend, canisterId, idlFactory} from "../../declarations/backend";
import {TagExpanded} from "../../utils/types";
import {useTags} from "../../contexts/TagsContext";
import Button from "../../components/Button/Button";
import {alertToast} from "../../utils/alerts";
import {useSiweIdentity} from "ic-use-siwe-identity";
import {Actor, HttpAgent} from "@dfinity/agent";

const MetadataForm = (props: {
    id: string|undefined,
    tag: TagExpanded|undefined,
    setSubscription: (sub: string) => void,
    setCertificateRegistered: (registered: boolean) => void,
    image: string|undefined,
    name: string|undefined,
    description: string|undefined,
    setName: (name: string) => void,
    setDescription: (description: string) => void,
    setImage: (image: string) => void
}) => {
    const {
        id,
        setCertificateRegistered,
        tag,
        setSubscription,
        name,
        setName,
        description,
        setDescription,
        image,
        setImage
    } = props;

    const inputRef = useRef<HTMLInputElement>(null);

    const [dataUpdated, setDataUpdated] = useState(false);
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const [isDataMissing, setIsDataMissing] = useState(true);
    const [buttonText, setButtonText] = useState("");
    const [
        buttonAction,
        setButtonAction
    ] = useState("save" as "save"|"register");

    const { identityAddress, identity } = useSiweIdentity();

    const { setSub } = useTags();

    useEffect(() => {
        setIsDataMissing(!image || image === "" || !name || name === "" || !description || description === "");
    }, [image, name, description]);

    useEffect(() => {
        if (tag) {
            if (!tag.registered) {
                setCertificateRegistered(false);
                setButtonText(isLoadingButton ? "Updating…" :
                    (dataUpdated || isDataMissing) ? "Save" : "Register");
                setButtonAction(dataUpdated || isDataMissing ? "save" : "register");
            } else {
                setCertificateRegistered(true);
            }
        }
    }, [tag, dataUpdated, isLoadingButton, isDataMissing, setCertificateRegistered]);

    const uploadFile = () => {
        if (inputRef.current?.files && identity) {
            const file = inputRef.current.files[0];
            const agent = new HttpAgent({ identity });
            agent.fetchRootKey().then(() => {
                const backendActor = Actor.createActor(
                    idlFactory,
                    {
                        agent,
                        canisterId
                    }
                );
                file.arrayBuffer().then((buffer) => {
                    const bytes = new Uint8Array(buffer);
                    if (id) {
                        backendActor.upload_media(
                            id,
                            {
                                content: bytes,
                                content_encoding: "identity",
                                content_type: file.type,
                                key: `/${id!}`,
                                sha256: []
                            }
                        )
                            .then((res: unknown) => {
                                const typedRes = res as UpdateResult;
                                if ("Ok" in typedRes) {
                                    backend.get_storage_principal(id!)
                                        .then((res) => {
                                            if ("Ok" in res) {
                                                setImage(
                                                    // todo: use localhost domain for local development
                                                    `https://${res.Ok.toString()}.icp0.io/${id!}`
                                                );
                                                alertToast("File updated");
                                            } else {
                                                alertToast(res.Err.toString(), true);
                                            }
                                        });
                                } else {
                                    alertToast(typedRes.Err.toString(), true);
                                }
                            })
                            .catch(() => {
                                alertToast("Server error", true);
                            });
                    } else {
                        alertToast("Id not found", true);
                    }
                });
            });
        }
    }

    const formAction = () => {
        setIsLoadingButton(true);
        if (tag && id && identityAddress && identity) {
            const agent = new HttpAgent({ identity });
            agent.fetchRootKey().then(() => {
                const backendActor = Actor.createActor(
                    idlFactory,
                    {
                        agent,
                        canisterId
                    }
                );
                if (buttonAction === 'save') {
                    const metadata = {
                        name: name || tag?.metadata?.name || "",
                        description: description || tag?.metadata?.description || "",
                        image: image || tag?.metadata?.image || "",
                        attributes: []
                    } as NFTMetadata;

                    backendActor.save_certificate(
                        id!,
                        metadata
                    )
                        .then((res: unknown) => {
                            const typedResult = res as UpdateResult;
                            setDataUpdated(false);
                            if ("Ok" in typedResult) {
                                alertToast("Success");
                                setSub(new Date().toISOString());
                                setSubscription(new Date().toISOString());
                            } else {
                                alertToast(typedResult.Err.toString(), true);
                            }
                            setIsLoadingButton(false);
                        })
                        .catch(() => {
                            alertToast("Server error", true);
                            setIsLoadingButton(false);
                        });

                } else {
                    backendActor.register_certificate(
                        id!,
                    ).then((res: unknown) => {
                        const typedResult = res as UpdateResult;
                        if ("Ok" in typedResult) {
                            alertToast("Success");
                            setCertificateRegistered(true);
                            setSubscription(new Date().toISOString());
                            setSub(new Date().toISOString());
                        } else {
                            alertToast(typedResult.Err.toString(), true);
                        }
                        setIsLoadingButton(false);
                    });
                }
            });
        }
    }


    return <div>
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
                    className={"rounded-0"}
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
                    className={"rounded-0"}
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
                    onChange={uploadFile}
                    className={"rounded-0"}
                />
                <Form.Text className="text-muted">
                    The image of the certificate.
                </Form.Text>
            </Form.Group>
        </Form>
        <div className={"d-flex flex-row-reverse"}>
            {
                tag && id && identityAddress ? <Button
                    variant="primary"
                    disabled={isLoadingButton || isDataMissing}
                    onClick={formAction}
                >
                    {buttonText}
                </Button> : null
            }
        </div>
    </div>;
}

export default MetadataForm;