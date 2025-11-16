import React, { useState } from "react";
import { Card, Form, Button, Alert, Spinner, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const usuarioAdmin = {
  nombre: "Administrador",
  correo: "admin@vh.com",
  telefono: "84188486",
  password: "SistemaRural2025!",
  rol: "administrador",
  secciones: ["Cliente", "Usuario", "Producto", "Proveedor", "Venta", "Compra"],
};

const usuarioCajero = {
  nombre: "Cajero",
  correo: "cajero@correo.com",
  telefono: "57136228",
  password: "Cajero@2025",
  rol: "cajero",
  secciones: ["Producto", "Venta"],
};

const fondoalmacenrural =
  "https://i.pinimg.com/736x/76/fb/4a/76fb4a687980c6b31824bc0752d66f10.jpg";

const Login = ({ setUsuarioLogueado }) => {
  const navigate = useNavigate();
  const [usuarioInput, setUsuarioInput] = useState(""); // correo o teléfono
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Mostrar/ocultar contraseña
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // Modal de recuperación
  const [showModal, setShowModal] = useState(false);
  const [correoRecuperacion, setCorreoRecuperacion] = useState("");
  const [passwordAnterior, setPasswordAnterior] = useState("");
  const [mensajeRecuperacion, setMensajeRecuperacion] = useState("");

  const manejarLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const esAdmin =
        (usuarioInput === usuarioAdmin.correo || usuarioInput === usuarioAdmin.telefono) &&
        password === usuarioAdmin.password;
      const esCajero =
        (usuarioInput === usuarioCajero.correo || usuarioInput === usuarioCajero.telefono) &&
        password === usuarioCajero.password;

      if (esAdmin || esCajero) {
        const usuarioLogueado = esAdmin ? usuarioAdmin : usuarioCajero;
        setUsuarioLogueado(usuarioLogueado);
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioLogueado));
        navigate("/", { replace: true });
      } else {
        setError("Usuario o contraseña incorrectos.");
      }
      setLoading(false);
    }, 800);
  };

  const manejarRecuperacion = (e) => {
    e.preventDefault();

    let usuario;
    if (correoRecuperacion === usuarioAdmin.correo || correoRecuperacion === usuarioAdmin.telefono) usuario = usuarioAdmin;
    if (correoRecuperacion === usuarioCajero.correo || correoRecuperacion === usuarioCajero.telefono) usuario = usuarioCajero;

    if (usuario && passwordAnterior === usuario.password) {
      const nuevaPassword = prompt("Ingresa tu nueva contraseña") || usuario.password;
      usuario.password = nuevaPassword;
      setMensajeRecuperacion(`Contraseña actualizada correctamente. Tu nueva contraseña es: ${usuario.password}`);
    } else {
      setMensajeRecuperacion("Correo o contraseña anterior incorrecta.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${fondoalmacenrural})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        padding: "10px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.25)",
          zIndex: 1,
        }}
      ></div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 500,
          margin: "60px auto",
        }}
      >
        <Card
          style={{
            width: "100%",
            padding: 40,
            borderRadius: 20,
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            fontSize: "1rem",
            lineHeight: "1.4",
            margin: "0 auto",
          }}
        >
          <div className="text-center mb-4">
            <img
              src={fondoalmacenrural}
              alt="logo"
              style={{
                width: 80,
                height: 80,
                borderRadius: 15,
                objectFit: "cover",
                boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
              }}
            />
            <h3 className="mt-3 fw-bold text-success" style={{ fontSize: "1.4rem" }}>
              Veterinaria Almacén Rural
            </h3>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={manejarLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Correo o Teléfono</Form.Label>
              <Form.Control
                type="text"
                list="usuariosDisponibles"
                value={usuarioInput}
                onChange={(e) => setUsuarioInput(e.target.value)}
                required
              />
              <datalist id="usuariosDisponibles">
                <option value={usuarioAdmin.correo} />
                <option value={usuarioAdmin.telefono} />
                <option value={usuarioCajero.correo} />
                <option value={usuarioCajero.telefono} />
              </datalist>
            </Form.Group>

            <Form.Group className="mb-1">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type={mostrarPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Mostrar contraseña"
                checked={mostrarPassword}
                onChange={() => setMostrarPassword(!mostrarPassword)}
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100"
              style={{
                backgroundColor: "#198754",
                border: "none",
                borderRadius: 12,
                padding: "14px 0",
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Iniciar sesión"}
            </Button>

            <div className="text-center mt-2">
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "#198754",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => setShowModal(true)}
              >
                Olvidé contraseña
              </span>
            </div>
          </Form>

          <div className="text-center mt-2 text-muted" style={{ fontSize: "0.9rem" }}>
            Acceso seguro • Solo personal autorizado
          </div>
        </Card>
      </div>

      {/* Modal de recuperación */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Recuperar Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {mensajeRecuperacion ? (
            <Alert variant="info">{mensajeRecuperacion}</Alert>
          ) : (
            <Form onSubmit={manejarRecuperacion}>
              <Form.Group className="mb-3">
                <Form.Label>Correo o Teléfono registrado</Form.Label>
                <Form.Control
                  type="text"
                  value={correoRecuperacion}
                  onChange={(e) => setCorreoRecuperacion(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contraseña anterior</Form.Label>
                <Form.Control
                  type="password"
                  value={passwordAnterior}
                  onChange={(e) => setPasswordAnterior(e.target.value)}
                  placeholder="Opcional para verificación"
                />
                <Form.Text className="text-muted">
                  Ingresa tu contraseña anterior para verificar tu identidad.
                </Form.Text>
              </Form.Group>

              <Button type="submit" className="w-100" style={{ backgroundColor: "#198754", border: "none" }}>
                Enviar solicitud
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Login;
