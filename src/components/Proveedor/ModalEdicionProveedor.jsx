import { Modal, Button, Form } from "react-bootstrap";

const ModalEdicionProveedor = ({
  mostrar,
  setMostrar,
  proveedorEditado,
  setProveedorEditado,
  guardarEdicion,
}) => {
  if (!proveedorEditado) return null;

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setProveedorEditado((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal show={mostrar} onHide={() => setMostrar(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Proveedor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="Nombre_Proveedor"
              value={proveedorEditado.Nombre_Proveedor}
              onChange={manejarCambio}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="Telefono"
              value={proveedorEditado.Telefono}
              onChange={manejarCambio}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="Email"
              value={proveedorEditado.Email}
              onChange={manejarCambio}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              name="Direccion"
              value={proveedorEditado.Direccion}
              onChange={manejarCambio}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Tipo Distribuidor</Form.Label>
            <Form.Control
              type="text"
              name="Tipo_Distribuidor"
              value={proveedorEditado.Tipo_Distribuidor}
              onChange={manejarCambio}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Condiciones de Pago</Form.Label>
            <Form.Control
              type="text"
              name="Condiciones_Pago"
              value={proveedorEditado.Condiciones_Pago}
              onChange={manejarCambio}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              name="Estado"
              value={proveedorEditado.Estado}
              onChange={manejarCambio}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button variant="success" onClick={guardarEdicion}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProveedor;
