import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { setDoc } from "@junobuild/core";

const NewTag = () => {
    const [owner, setOwner] = useState(undefined as string|undefined);
    const [tags, setTags] = useState([] as string[]);

    return <Container>
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
            <Button
                variant="primary"
                onClick={() => {
                    tags.forEach((tag) => {
                        setDoc({
                            collection: "tags",
                            doc: {
                                key: `${new Date().getTime()}`,
                                data: {
                                    tagId: tag,
                                    owner,
                                    registered: false
                                }
                            }
                        }).then();
                    });
                }}
            >
                Add new tags
            </Button>
        </Form>
    </Container>;
}

export default NewTag;
