import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalRegistroCliente = ({ mostrarModal, setMostrarModal, nuevoCliente, manejarCambioInput, agregarCliente }) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Primer Nombre</Form.Label>
            <Form.Control
              type="text"
              name="Nombre1"
              value={nuevoCliente.Nombre1}
              onChange={manejarCambioInput}
              className="form-control form-control-lg"
              placeholder="Ej: Juan"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Segundo Nombre</Form.Label>
            <Form.Control
              type="text"
              name="Nombre2"
              value={nuevoCliente.Nombre2}
              onChange={manejarCambioInput}
              className="form-control form-control-lg"
              placeholder="Ej: Carlos"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Primer Apellido</Form.Label>
            <Form.Control
              type="text"
              name="Apellido1"
              value={nuevoCliente.Apellido1}
              onChange={manejarCambioInput}
              className="form-control form-control-lg"
              placeholder="Ej: Pérez"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Segundo Apellido</Form.Label>
            <Form.Control
              type="text"
              name="Apellido2"
              value={nuevoCliente.Apellido2}
              onChange={manejarCambioInput}
              className="form-control form-control-lg"
              placeholder="Ej: Gómez"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              name="Direccion"
              value={nuevoCliente.Direccion}
              onChange={manejarCambioInput}
              className="form-control form-control-lg"
              placeholder="Ej: Barrio Central"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="Telefono"
              value={nuevoCliente.Telefono}
              onChange={manejarCambioInput}
              className="form-control form-control-lg"
              placeholder="Ej: 8888-8888"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button className="color-boton-registro w-100" onClick={agregarCliente}>
          Guardar Cliente
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCliente;
