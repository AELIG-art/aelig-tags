import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { getDoc, setDoc } from "@junobuild/core";
import { Tag } from "../../utils/types";

const NewTagModal = (props: {
    open: boolean,
    close: () => void;
}) => {
    const { open, close } = props;
    const [owner, setOwner] = useState(undefined as string|undefined);
    const [tags, setTags] = useState([] as string[]);

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
                        placeholder="Tag id"
                        onChange={(event) => {
                            setTags(event.target.value.split(","));
                        }}
                    />
                    <Form.Floating>Enter tag ids separated by a comma.</Form.Floating>
                </Form.Group>
            </Form>
        </Modal.Body>

        <Modal.Footer>
            <Button
                variant="secondary"
                onClick={close}
            >
                Close
            </Button>
            <Button
                variant="primary"
                onClick={() => {
                    if (owner) {
                        getDoc({
                            collection: 'tags',
                            key: owner
                        }).then((res) => {
                            let tagsFormatted = tags.map((tag: string) => {
                                return {
                                    id: Number(tag),
                                    registered: false
                                }
                            }) as Tag[];
                            if (res) {
                                const oldTags = res.data as Tag[];
                                tagsFormatted = tagsFormatted.concat(oldTags);
                            }
                            setDoc({
                                collection: "tags",
                                doc: {
                                    key: owner,
                                    data: tagsFormatted
                                }
                            }).then();
                        });
                    }
                }}
            >
                Add new tags
            </Button>
        </Modal.Footer>
    </Modal>;
};

export default NewTagModal;
