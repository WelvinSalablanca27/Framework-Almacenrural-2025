import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroCliente = ({
  mostrarModal,
  setMostrarModal,
  nuevoCliente,
  manejarCambioInput,
  agregarCliente,
}) => {
  return (
    <Modal  backdrop = "static" show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
  
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="Nombre1">
            <Form.Label>Nombre 1 del Cliente</Form.Label>
            <Form.Control
              type="text"
              name="Nombre1"
              value={nuevoCliente.Nombre1}
              onChange={manejarCambioInput}
              placeholder="Ej: Enrique"
              maxLength={20}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="Nombre2">
            <Form.Label>Nombre 2 del Cliente</Form.Label>
            <Form.Control
              type="text"
              name="Nombre2"
              value={nuevoCliente.Nombre2}
              onChange={manejarCambioInput}
              placeholder="Ej: Manuel"
              maxLength={20}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="Apellido1">
            <Form.Label>Apellido 1 del Cliente</Form.Label>
            <Form.Control
              type="text"
              name="Apellido1"
              value={nuevoCliente.primer_apelApellido1lido}
              onChange={manejarCambioInput}
              placeholder="Ej: Hernández"
              maxLength={20}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="Apellido2">
            <Form.Label>Apellido 2 del Cliente</Form.Label>
            <Form.Control
              type="text"
              name="Apellido2"
              value={nuevoCliente.Apellido2}
              onChange={manejarCambioInput}
              placeholder="Ej: Martínez"
              maxLength={20}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="Direccion">
            <Form.Label>Telefono del Cliente</Form.Label>
            <Form.Control
              type="text"
              name="celulaDireccionr"
              value={nuevoCliente.Direccion}
              onChange={manejarCambioInput}
              placeholder="Descripción opcional (máx. 100 caracteres)"
              maxLength={8}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="Telefono">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="Telefono"
              value={nuevoCliente.Telefono}
              onChange={manejarCambioInput}
              placeholder="Ej: 8538****"
              maxLength={150}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={agregarCliente}
          
        >
          Guardar Cliente
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCliente;