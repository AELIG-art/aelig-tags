import React, { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { canisterId, idlFactory} from "../../declarations/backend";
import { Actor, HttpAgent } from "@dfinity/agent";
import {enqueueSnackbar} from "notistack";
import Button from "../../components/Button/Button";
import {useSiweIdentity} from "ic-use-siwe-identity";

const NewTagModal = (props: {
    open: boolean,
    close: () => void;
    isNewTagCertificate: boolean;
}) => {
    const { open, close, isNewTagCertificate } = props;
    const [owner, setOwner] = useState(undefined as string|undefined);
    const [tags, setTags] = useState([] as string[]);
    const [shortIds, setShortIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { identity } = useSiweIdentity();

    const addNewTag = () => {
        if (owner && tags.length === shortIds.length) {
            tags.forEach((tag, index) => {
                if (identity) {
                    const agent = new HttpAgent({ identity });
                    agent.fetchRootKey().then(() => {
                        const backendActor = Actor.createActor(
                            idlFactory,
                            {
                                agent,
                                canisterId
                            }
                        );
                        setIsLoading(true);
                        backendActor.add_tag(
                            tag,
                            {
                                owner: owner,
                                is_certificate: isNewTagCertificate,
                                short_id: shortIds[index],
                                id: BigInt(`0x${tag}`)
                            }
                        ).then((res: unknown) => {
                            setIsLoading(false);
                            const resTyped = res as {
                                Ok?: string,
                                Err?: string
                            };
                            if (resTyped.Ok) {
                                close();
                                enqueueSnackbar(
                                    'Success',
                                    {
                                        variant: 'success',
                                        persist: false,
                                        preventDuplicate: true,
                                        transitionDuration: 3
                                    }
                                );
                            } else {
                                enqueueSnackbar(
                                    resTyped.Err,
                                    {
                                        variant: 'error',
                                        persist: false,
                                        preventDuplicate: true,
                                        transitionDuration: 3
                                    }
                                );
                            }
                        });
                    });
                }
            });
        }
    }


    return <Modal show={open} onHide={close}>
        <Modal.Header closeButton>
            <Modal.Title>Add new tag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter user wallet"
                        onChange={(event) => {
                            setOwner(event.target.value);
                        }}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Tag ids</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Tag ids"
                        onChange={(event) => {
                            setTags(event.target.value.split(","));
                        }}
                    />
                    <Form.Floating>Enter tag ids separated by a comma.</Form.Floating>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Tag short ids</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Tag short ids"
                        onChange={(event) => {
                            setShortIds(event.target.value.split(","));
                        }}
                    />
                    <Form.Floating>Enter tag short ids separated by a comma.</Form.Floating>
                </Form.Group>
            </Form>
        </Modal.Body>

        <Modal.Footer>
            <Button
                variant="secondary"
                onClick={close}
                secondary
            >
                Close
            </Button>
            <Button
                variant="primary"
                disabled={isLoading}
                onClick={addNewTag}
            >
                {isLoading ? "Updating…" : "Add new tags"}
            </Button>
        </Modal.Footer>
    </Modal>;
};

export default NewTagModal;
