import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import {MediaRenderer, useAddress, useConnectionStatus, useSigner, useStorageUpload} from "@thirdweb-dev/react";
import { SMART_CONTRACT_ADDRESS } from "../../utils/constants";
import {NFTMetadata} from "../../declarations/backend/backend.did";
import {backend} from "../../declarations/backend";
import {TagExpanded} from "../../utils/types";

const Tag = () => {
    let { id } = useParams();
    const [tag, setTag] = useState<undefined|TagExpanded>();

    const [name, setName] = useState<undefined|string>();
    const [description, setDescription] = useState<undefined|string>();
    const { mutateAsync: upload} = useStorageUpload();
    const inputRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<undefined|string>();

    const signer = useSigner();
    const address = useAddress();
    const navigate = useNavigate();
    const connectionStatus = useConnectionStatus();

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
                                }
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
    }, [id, address, connectionStatus]);

    return <div>
        <h1>{tag?.short_id || tag?.id.toString(16)}</h1>
        <Link to={"/"}>Back</Link>
        <div className={"row mt-3"}>
            <div className={"col-6"}>
                <div className={"d-flex w-100 h-100 border rounded"}>
                    {
                        image ? <MediaRenderer src={image} alt="Certificate" className={"w-100 h-100"} /> : null
                    }
                </div>
            </div>
            <div className={"col-6"}>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Name"
                            value={name || tag?.metadata?.name || ""}
                            onChange={(event) => setName(event.target.value)}
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
                            onChange={(event) => setDescription(event.target.value)}
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
                    <Button
                        variant="primary"
                        onClick={() => {
                            if (signer && tag && id && address) {
                                const messageJson = {
                                    name: name || tag?.metadata?.name || "",
                                    description: description || tag?.metadata?.description || "",
                                    image: image || tag?.metadata?.image || "",
                                    attributes: [],
                                    identifier: `gnosis:${SMART_CONTRACT_ADDRESS}:${tag?.id}`
                                }
                                signer.signMessage(JSON.stringify(messageJson)).then((signature) => {
                                    const metadata = {
                                        name: name || tag?.metadata?.name || "",
                                        description: description || tag?.metadata?.description || "",
                                        image: image || tag?.metadata?.image || "",
                                        attributes: []
                                    } as NFTMetadata;
                                    backend.save_certificate(
                                        id!,
                                        metadata,
                                        address,
                                        signature
                                    ).then((res) => {
                                        console.log(res);
                                    }).catch(console.log);
                                });
                            }
                        }}
                    >
                        Save
                    </Button>

                    <Button
                        className={"me-3"}
                    >
                        Register
                    </Button>
                </div>
            </div>
        </div>
    </div>;
}

export default Tag;
