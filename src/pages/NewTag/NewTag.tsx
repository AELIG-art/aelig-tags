import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { getDoc, setDoc } from "@junobuild/core";
import { Tag } from "../../utils/types";

const NewTag = () => {
    const [owner, setOwner] = useState(undefined as string|undefined);
    const [tags, setTags] = useState([] as string[]);

    return <div>
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
        </Form>
    </div>;
}

export default NewTag;
