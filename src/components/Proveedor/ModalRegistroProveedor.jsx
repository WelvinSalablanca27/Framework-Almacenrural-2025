import { Modal, Button, Form } from "react-bootstrap";

const ModalRegistroProveedor = ({
  mostrarModal,
  setMostrarModal,
  nuevoProveedor,
  setNuevoProveedor,
  manejarCambioInput,
  agregarProveedor,
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Proveedor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="Nombre_Proveedor"
              value={nuevoProveedor.Nombre_Proveedor}
              onChange={manejarCambioInput}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="Telefono"
              value={nuevoProveedor.Telefono}
              onChange={manejarCambioInput}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="Email"
              value={nuevoProveedor.Email}
              onChange={manejarCambioInput}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              name="Direccion"
              value={nuevoProveedor.Direccion}
              onChange={manejarCambioInput}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Tipo Distribuidor</Form.Label>
            <Form.Control
              type="text"
              name="Tipo_Distribuidor"
              value={nuevoProveedor.Tipo_Distribuidor}
              onChange={manejarCambioInput}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Condiciones de Pago</Form.Label>
            <Form.Control
              type="text"
              name="Condiciones_Pago"
              value={nuevoProveedor.Condiciones_Pago}
              onChange={manejarCambioInput}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              name="Estado"
              value={nuevoProveedor.Estado}
              onChange={manejarCambioInput}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="success" onClick={agregarProveedor}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProveedor;
