import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionUsuario = ({
  mostrar,
  setMostrar,
  usuarioEditado,
  setUsuarioEditado,
  guardarEdicion,
}) => {
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setUsuarioEditado((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal backdrop="static" show={mostrar} onHide={() => setMostrar(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={usuarioEditado?.nombre}
              onChange={manejarCambio}
              placeholder="Ej: Enrique"
              maxLength={20}
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="apellido">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellido"
              value={usuarioEditado?.apellido}
              onChange={manejarCambio}
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
              value={usuarioEditado?.correo_electronico}
              onChange={manejarCambio}
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
              value={usuarioEditado?.contrasena}
              onChange={manejarCambio}
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
              value={usuarioEditado?.telefono}
              onChange={manejarCambio}
              placeholder="Ej: 85381234"
              maxLength={8}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="genero">
            <Form.Label>Género</Form.Label>
            <Form.Select
              name="genero"
              value={usuarioEditado?.genero}
              onChange={manejarCambio}
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
              value={usuarioEditado?.rol}
              onChange={manejarCambio}
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
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={guardarEdicion}
          disabled={!usuarioEditado?.nombre?.trim()}
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionUsuario;
