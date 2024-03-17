import React from "react";
import { Metadata } from "../../utils/types";
import { Button, Modal } from "react-bootstrap";

const MetadataModal = (props: {
    open: boolean,
    close: () => void,
    metadata: undefined|Metadata
}) => {
    const {open, close, metadata} = props;

    return <Modal show={open} onHide={close}>
        <Modal.Header closeButton>
            <Modal.Title>Tag metadata</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <h5>Name</h5>
            <p>{metadata?.name || '-'}</p>
            <h5>Image</h5>
            {metadata?.image ?
                <img
                    src={`https://w3s.link/ipfs/${metadata.image.slice(7)}`}
                    alt={"Could not fetch from ipfs."}
                    className={'w-100 mb-3'}
                /> : <p>-</p>
            }
            <h5>Description</h5>
            {metadata?.description.split('\n').map((text) => <p>{text}</p>) || '-'}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={close}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>;
}

export default MetadataModal;
