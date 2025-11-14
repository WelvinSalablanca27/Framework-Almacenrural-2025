import React, { useState } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";

const usuarioAdmin = {
  nombre: "Administrador",
  correo: "admin@vh.com",
  password: "SistemaRural2025!",
  secciones: ["Cliente", "Usuario", "Producto", "Proveedor", "Venta", "Compra"],
};

const fondoalmacenrural =
  "https://i.pinimg.com/736x/76/fb/4a/76fb4a687980c6b31824bc0752d66f10.jpg";

const Login = ({ setUsuarioLogueado }) => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const manejarLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (correo === usuarioAdmin.correo && password === usuarioAdmin.password) {
        setUsuarioLogueado(usuarioAdmin);
      } else {
        setError("Correo o contraseña incorrectos.");
      }
      setLoading(false);
    }, 800);
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
        backgroundAttachment: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        padding: "10px",
      }}
    >
      {/* Capa semitransparente */}
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

      {/* Card centrado con más ancho y alto */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 600, // más ancho
          margin: "80px auto",
        }}
      >
        <Card
          className="card"
          style={{
            width: "100%",
            padding: 70, // más espacio interno
            borderRadius: 20,
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 18px 45px rgba(0,0,0,0.25)",
            animation: "fadeIn 0.8s ease, slideDown 0.8s ease",
            fontSize: "1.1rem",
            lineHeight: "1.6",
            margin: "0 auto",
          }}
        >
          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; } 
                to { opacity: 1; }
              }
              @keyframes slideDown {
                from { transform: translateY(-25px); }
                to { transform: translateY(0); }
              }
              .input-focus {
                transition: all 0.3s;
                margin-bottom: 25px;
              }
              .input-focus:focus {
                box-shadow: 0 0 0 2px #19875490 !important;
                border-color: #198754 !important;
              }
              .link-forgot {
                font-size: 0.95rem;
                color: #198754;
                text-decoration: underline;
                cursor: pointer;
              }
              .link-forgot:hover {
                color: #145c32;
              }
              .btn-login:disabled {
                background-color: #19875480 !important;
              }

              @media (max-width: 480px) {
                .card {
                  padding: 40px; /* menos padding en móviles */
                }
              }
            `}
          </style>

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
                className="input-focus"
                value={correo}
                placeholder="correo@ejemplo.com"
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
              <datalist id="usuariosDisponibles">
                <option value={usuarioAdmin.correo} />
              </datalist>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                className="input-focus"
                value={password}
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 btn-login"
              style={{
                backgroundColor: "#198754",
                border: "none",
                borderRadius: 12,
                padding: "18px 0",
                fontWeight: "bold",
                fontSize: "1.25rem",
                boxShadow: "0 4px 14px rgba(25,135,84,0.4)",
              }}
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Ingresar"}
            </Button>

            <div className="text-center mt-3">
              <span className="link-forgot">Olvidé contraseña</span>
            </div>
          </Form>

          <div className="text-center mt-3 text-muted" style={{ fontSize: "1rem" }}>
            Acceso seguro • Solo personal autorizado
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;