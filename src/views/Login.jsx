import React, { useState } from "react";
import { Card, Form, Button, Alert, Spinner, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const usuarioAdmin = {
  nombre: "Administrador",
  correo: "admin@vh.com",
  password: "SistemaRural2025!",
  rol: "administrador",
  secciones: ["Cliente", "Usuario", "Producto", "Proveedor", "Venta", "Compra"],
};

const usuarioCajero = {
  nombre: "Cajero",
  correo: "cajero@correo.com",
  password: "Cajero@2025",
  rol: "cajero",
  secciones: ["Producto", "Venta"],
};

const fondoalmacenrural =
  "https://i.pinimg.com/736x/76/fb/4a/76fb4a687980c6b31824bc0752d66f10.jpg";

const Login = ({ setUsuarioLogueado }) => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Estado del modal de recuperación
  const [showModal, setShowModal] = useState(false);
  const [correoRecuperacion, setCorreoRecuperacion] = useState("");
  const [passwordAnterior, setPasswordAnterior] = useState("");
  const [mensajeRecuperacion, setMensajeRecuperacion] = useState("");

  const manejarLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (
        (correo === usuarioAdmin.correo && password === usuarioAdmin.password) ||
        (correo === usuarioCajero.correo && password === usuarioCajero.password)
      ) {
        const usuarioLogueado =
          correo === usuarioAdmin.correo ? usuarioAdmin : usuarioCajero;

        setUsuarioLogueado(usuarioLogueado);
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioLogueado));

        navigate("/", { replace: true });
      } else {
        setError("Correo o contraseña incorrectos.");
      }
      setLoading(false);
    }, 800);
  };

  const manejarRecuperacion = (e) => {
    e.preventDefault();

    // Simular verificación básica
    if (
      correoRecuperacion === usuarioAdmin.correo ||
      correoRecuperacion === usuarioCajero.correo
    ) {
      setMensajeRecuperacion(
        "Se ha recibido tu solicitud de recuperación. Por seguridad, revisa tu correo registrado o contacta al administrador para restablecer la contraseña."
      );
    } else {
      setMensajeRecuperacion(
        "El correo ingresado no coincide con nuestros registros. Verifica e intenta nuevamente."
      );
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
          maxWidth: 600,
          margin: "80px auto",
        }}
      >
        <Card
          style={{
            width: "100%",
            padding: 70,
            borderRadius: 20,
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 18px 45px rgba(0,0,0,0.25)",
            fontSize: "1.1rem",
            lineHeight: "1.6",
            margin: "0 auto",
          }}
        >
          <div className="text-center mb-4">
            <img
              src={fondoalmacenrural}
              alt="logo"
              style={{
                width: 95,
                height: 95,
                borderRadius: 20,
                objectFit: "cover",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
            />
            <h3 className="mt-3 fw-bold text-success" style={{ fontSize: "1.6rem" }}>
              Veterinaria Almacén Rural
            </h3>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={manejarLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                list="usuariosDisponibles"
                value={correo}
                placeholder="correo@ejemplo.com"
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
              <datalist id="usuariosDisponibles">
                <option value={usuarioAdmin.correo} />
                <option value={usuarioCajero.correo} />
              </datalist>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={password}
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100"
              style={{
                backgroundColor: "#198754",
                border: "none",
                borderRadius: 12,
                padding: "18px 0",
                fontWeight: "bold",
                fontSize: "1.25rem",
              }}
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Iniciar sesión"}
            </Button>

            <div className="text-center mt-3">
              <span
                style={{
                  fontSize: "0.95rem",
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

          <div className="text-center mt-3 text-muted" style={{ fontSize: "1rem" }}>
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
                <Form.Label>Correo registrado</Form.Label>
                <Form.Control
                  type="email"
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
                  Puedes ingresar tu contraseña anterior para verificar tu identidad.
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
