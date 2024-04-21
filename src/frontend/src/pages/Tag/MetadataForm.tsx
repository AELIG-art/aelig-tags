import React, {useEffect, useRef, useState} from "react";
import {Form} from "react-bootstrap";
import {NFTMetadata} from "../../declarations/backend/backend.did";
import {backend} from "../../declarations/backend";
import {enqueueSnackbar} from "notistack";
import {useAddress, useSigner, useStorageUpload} from "@thirdweb-dev/react";
import {TagExpanded} from "../../utils/types";
import {useTags} from "../../contexts/TagsContext";
import Button from "../../components/Button/Button";

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

    const { mutateAsync: upload} = useStorageUpload();
    const inputRef = useRef<HTMLInputElement>(null);


    const [dataUpdated, setDataUpdated] = useState(false);
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const [isDataMissing, setIsDataMissing] = useState(true);
    const [buttonText, setButtonText] = useState("");
    const [
        buttonAction,
        setButtonAction
    ] = useState("save" as "save"|"register");

    const signer = useSigner();
    const address = useAddress();

    const { setSub } = useTags();

    useEffect(() => {
        setIsDataMissing(!image || image === "" || !name || name === "" || !description || description === "");
    }, [image, name, description]);

    useEffect(() => {
        if (tag) {
            if (!tag.registered) {
                setCertificateRegistered(false);
                setButtonText(isLoadingButton ? "Updating…" : (dataUpdated || isDataMissing) ? "Save" : "Register");
                setButtonAction(dataUpdated || isDataMissing ? "save" : "register");
            } else {
                setCertificateRegistered(true);
            }
        }
    }, [tag, dataUpdated, isLoadingButton]);


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
                />
                <Form.Text className="text-muted">
                    The image of the certificate.
                </Form.Text>
            </Form.Group>
        </Form>
        <div className={"d-flex flex-row-reverse"}>
            {
                signer && tag && id && address ? <Button
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
    </div>;
}

export default MetadataForm;