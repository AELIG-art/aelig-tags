import React, { useRef, useState } from "react";
import { useTags } from "../../contexts/TagsContext";
import { Link, useParams } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { useAddress, useSigner, useStorageUpload } from "@thirdweb-dev/react";
import { smartContractAddress } from "../../utils/constants";
import { Metadata } from "../../utils/types";
import { setDoc } from "@junobuild/core";

const Tag = () => {
    const { tags } = useTags();
    let { id } = useParams();
    const tag = tags.find((tag) => tag.id.toString() === id);
    const [name, setName] = useState(undefined as undefined|string);
    const [
        description,
        setDescription
    ] = useState(undefined as undefined|string);
    const { mutateAsync: upload} = useStorageUpload();
    const inputRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState(undefined as undefined|string);
    const signer = useSigner();
    const address = useAddress();

    return <div>
        <h1>{tag?.shortId || tag?.id}</h1>
        <Link to={"/"}>Back</Link>
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

            <Button
                variant="primary"
                onClick={() => {
                    if (signer && tag) {
                        const messageJson = {
                            name: name || tag?.metadata?.name || "",
                            description: description || tag?.metadata?.description || "",
                            image: image || tag?.metadata?.image || "",
                            attributes: [],
                            identifier: `gnosis:${smartContractAddress}:${tag?.id}`
                        }
                        signer.signMessage(JSON.stringify(messageJson)).then((signature) => {
                            console.log(signature);
                            const metadata = {
                                name: name || tag?.metadata?.name || "",
                                description: description || tag?.metadata?.description || "",
                                image: image || tag?.metadata?.image || "",
                                attributes: [],
                                author: address,
                                signature
                            } as Metadata;
                            setDoc({
                                collection: 'metadata',
                                doc: {
                                    key: tag?.id.toString(),
                                    data: metadata
                                }
                            }).then((r) => console.log(r));
                        });
                    }
                }}
            >
                Save
            </Button>
        </Form>
    </div>;
}

export default Tag;
