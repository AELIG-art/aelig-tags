import React, { useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import Button from '../../components/Button/Button';
import { alertToast } from '../../utils/alerts';
import { useBackendActor } from '../../contexts/BackendActorContext';

const TransferFrameModal = (props: {
  open: boolean;
  close: () => void;
  frameId: string;
}) => {
  const { open, close, frameId } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [newOwner, setNewOwner] = useState<string>();
  const { backendActor } = useBackendActor();

  const transferFrame = () => {
    if (backendActor) {
      setIsLoading(true);
      backendActor.transfer_frame(frameId, newOwner).then((res: unknown) => {
        setIsLoading(false);
        const resTyped = res as {
          Ok?: string;
          Err?: string;
        };
        if (resTyped.Ok) {
          close();
          alertToast('Success');
        } else {
          alertToast(resTyped.Err!, true);
        }
      });
    }
  };

  const handleClose = () => {
    setIsLoading(false);
    close();
  };

  return (
    <Modal show={open} onHide={handleClose} contentClassName={'rounded-0'}>
      <Modal.Header closeButton>
        <Modal.Title>Transfer frame {frameId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>To address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter user wallet"
              onChange={(event) => {
                setNewOwner(event.target.value);
              }}
              className={'rounded-0'}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={close} secondary>
          Close
        </Button>
        <Button variant="primary" disabled={isLoading} onClick={transferFrame}>
          {isLoading ? 'Updating…' : 'Transfer frame'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransferFrameModal;
