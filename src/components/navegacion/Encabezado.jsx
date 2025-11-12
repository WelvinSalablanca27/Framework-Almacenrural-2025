import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Nav, Navbar, Offcanvas } from "react-bootstrap"; // QUITÉ Container

const Encabezado = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const manejarToggle = () => setMostrarMenu(!mostrarMenu);

  const manejarNavegacion = (ruta) => {
    navigate(ruta);
    setMostrarMenu(false);
  };

  const esRutaActiva = (ruta) => location.pathname.toLowerCase() === ruta.toLowerCase();

  return (
    <Navbar 
      expand="md" 
      fixed="top" 
      className="bg-primary" 
      style={{ minHeight: "44px" }}
    >
      {/* QUITÉ <Container> PARA QUE QUEDE PEGADO AL BORDE */}
      <Navbar.Brand
        onClick={() => manejarNavegacion("/")}
        className="text-white fw-bold ms-2"  // ← Añadí margen izquierdo pequeño
        style={{ fontSize: "1rem", cursor: "pointer" }}
      >
        Almacen-rural
      </Navbar.Brand>

      <Navbar.Toggle
        aria-controls="menu-offcanvas"
        onClick={manejarToggle}
        className="bg-light p-1 me-2"  // ← Ajusté margen derecho
        style={{ fontSize: "0.9rem" }}
      />

      <Navbar.Offcanvas
        id="menu-offcanvas"
        placement="end"
        show={mostrarMenu}
        onHide={() => setMostrarMenu(false)}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold text-primary">Menú principal</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-grow-1 pe-3">
            {/* INICIO */}
            <Nav.Link
              onClick={() => manejarNavegacion("/")}
              className={`d-flex align-items-center ${
                esRutaActiva("/") ? "bg-white text-primary fw-bold shadow-sm" : "text-dark"
              }`}
              style={{
                borderBottom: esRutaActiva("/") ? "3px solid #0d6efd" : "none",
                padding: "0.6rem 1rem",
                borderRadius: "0.375rem",
                margin: "0.25rem 0",
              }}
            >
              <i className="bi bi-house-fill me-2"></i> Inicio
            </Nav.Link>

            {/* USUARIOS */}
            <Nav.Link
              onClick={() => manejarNavegacion("/usuarios")}
              className={`d-flex align-items-center ${
                esRutaActiva("/usuarios") ? "bg-white text-primary fw-bold shadow-sm" : "text-dark"
              }`}
              style={{
                borderBottom: esRutaActiva("/usuarios") ? "3px solid #0d6efd" : "none",
                padding: "0.6rem 1rem",
                borderRadius: "0.375rem",
                margin: "0.25rem 0",
              }}
            >
              <i className="bi bi-people-fill me-2"></i> Usuarios
            </Nav.Link>

            {/* CLIENTE */}
            <Nav.Link
              onClick={() => manejarNavegacion("/cliente")}
              className={`d-flex align-items-center ${
                esRutaActiva("/cliente") ? "bg-white text-primary fw-bold shadow-sm" : "text-dark"
              }`}
              style={{
                borderBottom: esRutaActiva("/cliente") ? "3px solid #0d6efd" : "none",
                padding: "0.6rem 1rem",
                borderRadius: "0.375rem",
                margin: "0.25rem 0",
              }}
            >
              <i className="bi bi-person-circle me-2"></i> Cliente
            </Nav.Link>

            {/* VENTA */}
            <Nav.Link
              onClick={() => manejarNavegacion("/venta")}
              className={`d-flex align-items-center ${
                esRutaActiva("/venta") ? "bg-white text-primary fw-bold shadow-sm" : "text-dark"
              }`}
              style={{
                borderBottom: esRutaActiva("/venta") ? "3px solid #0d6efd" : "none",
                padding: "0.6rem 1rem",
                borderRadius: "0.375rem",
                margin: "0.25rem 0",
              }}
            >
              <i className="bi bi-graph-up-arrow me-2"></i> Venta
            </Nav.Link>

            {/* COMPRA */}
            <Nav.Link
              onClick={() => manejarNavegacion("/compra")}
              className={`d-flex align-items-center ${
                esRutaActiva("/compra") ? "bg-white text-primary fw-bold shadow-sm" : "text-dark"
              }`}
              style={{
                borderBottom: esRutaActiva("/compra") ? "3px solid #0d6efd" : "none",
                padding: "0.6rem 1rem",
                borderRadius: "0.375rem",
                margin: "0.25rem 0",
              }}
            >
              <i className="bi bi-basket-fill me-2"></i> Compra
            </Nav.Link>

            {/* PROVEEDOR */}
            <Nav.Link
              onClick={() => manejarNavegacion("/proveedor")}
              className={`d-flex align-items-center ${
                esRutaActiva("/proveedor") ? "bg-white text-primary fw-bold shadow-sm" : "text-dark"
              }`}
              style={{
                borderBottom: esRutaActiva("/proveedor") ? "3px solid #0d6efd" : "none",
                padding: "0.6rem 1rem",
                borderRadius: "0.375rem",
                margin: "0.25rem 0",
              }}
            >
              <i className="bi bi-truck-front-fill me-2"></i> proveedor
            </Nav.Link>

            {/* PRODUCTO */}
            <Nav.Link
              onClick={() => manejarNavegacion("/producto")}
              className={`d-flex align-items-center ${
                esRutaActiva("/producto") ? "bg-white text-primary fw-bold shadow-sm" : "text-dark"
              }`}
              style={{
                borderBottom: esRutaActiva("/producto") ? "3px solid #0d6efd" : "none",
                padding: "0.6rem 1rem",
                borderRadius: "0.375rem",
                margin: "0.25rem 0",
              }}
            >
              <i className="bi bi-box-fill me-2"></i> Producto
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
      {/* QUITÉ </Container> */}
    </Navbar>
  );
};

export default Encabezado;
