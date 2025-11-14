import React, { useState } from "react";
import { Card, Form, Button, Alert, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Usuario administrador
const usuarioAdmin = {
  nombre: "Administrador",
  password: "SistemaRural2025!",
  secciones: ["Cliente", "Usuario", "Producto", "Proveedor", "Venta", "Compra"],
};

const Inicio = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [logueado, setLogueado] = useState(false);

  const navigate = useNavigate();

  const manejarLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!usuario || !password) {
      setError("Por favor complete todos los campos");
      return;
    }

    if (usuario === usuarioAdmin.nombre && password === usuarioAdmin.password) {
      setLogueado(true);
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  const manejarLogout = () => {
    setLogueado(false);
    setUsuario("");
    setPassword("");
  };

  if (!logueado) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8f9fa",
        }}
      >
        <Card
          style={{
            width: 450,
            padding: 30,
            borderRadius: 16,
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            backgroundColor: "white",
          }}
        >
          <div className="text-center mb-4">
            <img
              src="https://i.pinimg.com/736x/76/fb/4a/76fb4a687980c6b31824bc0752d66f10.jpg"
              alt="logo"
              style={{ width: 80, height: 80, borderRadius: 16 }}
            />
            <h3 className="mt-3">Veterinaria Almacen Rural</h3>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={manejarLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" className="w-100 mb-2" size="lg">
              Iniciar sesión
            </Button>
          </Form>

          <div className="text-center mt-3" style={{ fontSize: ".85rem", color: "#6b7280" }}>
            Acceso seguro • Solo personal autorizado
          </div>
        </Card>
      </div>
    );
  }

  // Panel con todas las secciones
  return (
    <div style={{ padding: 30 }}>
      <h2>Bienvenido, {usuarioAdmin.nombre}</h2>
      <Button variant="danger" className="mb-3" onClick={manejarLogout}>
        Cerrar sesión
      </Button>

      <Nav variant="tabs">
        {usuarioAdmin.secciones.map((sec) => (
          <Nav.Item key={sec}>
            <Nav.Link onClick={() => navigate(`/${sec.toLowerCase()}`)}>{sec}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <div style={{ marginTop: 20 }}>
        <p>Seleccione una sección para trabajar.</p>
      </div>
    </div>
  );
};

export default Inicio;
