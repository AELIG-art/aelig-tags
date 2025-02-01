import React, { useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import Button from '../../components/Button/Button';
import { alertToast } from '../../utils/alerts';
import { useBackendActor } from '../../contexts/BackendActorContext';

const NewTagModal = (props: {
  open: boolean;
  close: () => void;
  isNewTagCertificate: boolean;
}) => {
  const { open, close, isNewTagCertificate } = props;
  const [owner, setOwner] = useState(undefined as string | undefined);
  const [tags, setTags] = useState([] as string[]);
  const [shortIds, setShortIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { backendActor } = useBackendActor();

  const addNewTag = () => {
    if (owner && tags.length === shortIds.length) {
      tags.forEach((tag, index) => {
        if (backendActor) {
          setIsLoading(true);
          backendActor
            .add_tag(tag, {
              owner: owner,
              is_certificate: isNewTagCertificate,
              short_id: shortIds[index],
              id: tag,
            })
            .then((res: unknown) => {
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
              className={'rounded-0'}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Tag ids</Form.Label>
            <Form.Control
              type="text"
              placeholder="Tag ids"
              onChange={(event) => {
                setTags(event.target.value.split(','));
              }}
              className={'rounded-0'}
            />
            <Form.Floating>Enter tag ids separated by a comma.</Form.Floating>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Tag short ids</Form.Label>
            <Form.Control
              type="text"
              placeholder="Tag short ids"
              onChange={(event) => {
                setShortIds(event.target.value.split(','));
              }}
              className={'rounded-0'}
            />
            <Form.Floating>
              Enter tag short ids separated by a comma.
            </Form.Floating>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={close} secondary>
          Close
        </Button>
        <Button variant="primary" disabled={isLoading} onClick={addNewTag}>
          {isLoading ? 'Updating…' : 'Add new tags'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewTagModal;
