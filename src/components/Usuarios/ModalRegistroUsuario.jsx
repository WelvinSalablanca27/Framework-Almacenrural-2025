import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroUsuario = ({
  mostrarModal,
  setMostrarModal,
  nuevoUsuario,
  manejarCambioInput,
  agregarUsuario,
}) => {
  return (
    <Modal backdrop="static" show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={nuevoUsuario.nombre}
              onChange={manejarCambioInput}
              placeholder="Ej: Enrique"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="apellido">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellido"
              value={nuevoUsuario.apellido}
              onChange={manejarCambioInput}
              placeholder="Ej: Hernández"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="correo_electronico">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              name="correo_electronico"
              value={nuevoUsuario.correo_electronico}
              onChange={manejarCambioInput}
              placeholder="Ej: usuario@correo.com"
              maxLength={40}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="contrasena">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="contrasena"
              value={nuevoUsuario.contrasena}
              onChange={manejarCambioInput}
              placeholder="Mínimo 6 caracteres"
              maxLength={18}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="telefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              value={nuevoUsuario.telefono}
              onChange={manejarCambioInput}
              placeholder="Ej: 85381234"
              maxLength={8}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="genero">
            <Form.Label>Género</Form.Label>
            <Form.Select
              name="genero"
              value={nuevoUsuario.genero}
              onChange={manejarCambioInput}
              required
            >
              <option value="">Seleccione</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="rol">
            <Form.Label>Rol</Form.Label>
            <Form.Select
              name="rol"
              value={nuevoUsuario.rol}
              onChange={manejarCambioInput}
              required
            >
              <option value="">Seleccione</option>
              <option value="admin">Admin</option>
              <option value="cajero">Cajero</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={agregarUsuario}>
          Guardar Usuario
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroUsuario;
