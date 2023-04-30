import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import CurrencyInput from "react-currency-input-field";

export const ModalAccount = ({ modalShow, modalClose }) => {
  const [form, setform] = useState({
    name: "",
    amount: 0,
  });
  const [disableButton, setDisableButton] = useState(true);

  const getInputValue = (e, name = undefined) => {
    if (name) {
      setform({
        ...form,
        [name]: parseFloat(e),
      });
    } else {
      setform({
        ...form,
        [e.target.name]: e.target.value,
      });
    }

    if (form.name && form.amount > 0) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  };

  return (
    <Modal
      show={modalShow}
      onHide={modalClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Registar Cuenta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombres</Form.Label>
            <Form.Control
              type="text"
              placeholder="Sebas"
              name="name"
              onChange={getInputValue}
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>¿Cuanto?</Form.Label>
            <CurrencyInput
              name="amount"
              className="form-control"
              placeholder="Please enter a number"
              defaultValue={0}
              intlConfig={{ locale: "en-US", currency: "USD" }}
              onValueChange={(value, name) => getInputValue(value, name)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => modalClose()}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          disabled={disableButton}
          onClick={() => modalClose(form)}
        >
          Agregar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
