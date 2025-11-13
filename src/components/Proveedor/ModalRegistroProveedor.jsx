import { Modal, Button, Form } from "react-bootstrap";

const ModalRegistroProveedor = ({
  mostrarModal,
  setMostrarModal,
  nuevoProveedor,
  setNuevoProveedor,
  manejarCambioInput,
  agregarProveedor
}) => {
  // Lista de proveedores predefinidos
  const listaProveedores = [
    'Distribuidora AnimalCare',
    'Pet Health S.A.',
    'CleanPet Co.',
    'Mascotas Feliz Ltda',
    'SuperPet Import',
    'Almacen Macota',
    'BioMascotas S.A.',
    'Veterinaria Global',
    'PetCare Solutions',
    'Mascota Sana'
  ];

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      size="md" // tamaño mediano para que no se vea gigante
      centered
    >
      <Modal.Header 
        closeButton
        style={{ 
          backgroundColor: "#d4edda", // verde clarito
          borderBottom: "2px solid #28a745" 
        }}
      >
        <Modal.Title style={{ color: "#155724" }}>Registrar Proveedor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Nombre Proveedor</Form.Label>
            <Form.Select
              name="Nombre_Proveedor"
              value={nuevoProveedor.Nombre_Proveedor}
              onChange={manejarCambioInput}
            >
              <option value="">-- Seleccione un proveedor --</option>
              {listaProveedores.map((prov, index) => (
                <option key={index} value={prov}>
                  {prov}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="Telefono"
              value={nuevoProveedor.Telefono}
              onChange={manejarCambioInput}
              size="sm" // más compacto
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="Email"
              value={nuevoProveedor.Email}
              onChange={manejarCambioInput}
              size="sm"
              style={{ maxWidth: "250px" }} // limita ancho máximo
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              name="Direccion"
              value={nuevoProveedor.Direccion}
              onChange={manejarCambioInput}
              size="sm"
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Tipo Distribuidor</Form.Label>
            <Form.Control
              type="text"
              name="Tipo_Distribuidor"
              value={nuevoProveedor.Tipo_Distribuidor}
              onChange={manejarCambioInput}
              size="sm"
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Condiciones de Pago</Form.Label>
            <Form.Control
              type="text"
              name="Condiciones_Pago"
              value={nuevoProveedor.Condiciones_Pago}
              onChange={manejarCambioInput}
              size="sm"
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              name="Estado"
              value={nuevoProveedor.Estado}
              onChange={manejarCambioInput}
              size="sm"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="success" onClick={agregarProveedor}>
          Registrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProveedor;