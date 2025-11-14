import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Offcanvas, Nav } from "react-bootstrap";

const Encabezado = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);

  const toggleMenu = () => setShow(!show);

  const navegar = (ruta) => {
    navigate(ruta);
    setShow(false); // cierra menú al hacer clic
  };

  const activo = (ruta) => location.pathname === ruta;

  // No mostrar barra en login o inicio
  if (location.pathname === "/" || location.pathname === "/login") return null;

  const menuItems = [
    { ruta: "/", icono: "bi-house-door-fill", nombre: "Inicio" },
    { ruta: "/usuarios", icono: "bi-people-fill", nombre: "Usuarios" },
    { ruta: "/cliente", icono: "bi-person-circle", nombre: "Cliente" },
    { ruta: "/producto", icono: "bi-box-seam-fill", nombre: "Producto" },
    { ruta: "/proveedor", icono: "bi-truck", nombre: "Proveedor" },
    { ruta: "/venta", icono: "bi-graph-up-arrow", nombre: "Venta" },
    { ruta: "/compra", icono: "bi-cart-fill", nombre: "Compra" },
  ];

  return (
    <>
      <Navbar bg="primary" variant="dark" fixed="top" className="shadow-sm" style={{ height: "56px" }}>
        <div className="container-fluid d-flex justify-content-between align-items-center px-3">
          <Navbar.Brand
            onClick={() => navegar("/")}
            className="fw-bold text-white"
            style={{ cursor: "pointer", fontSize: "1.35rem" }}
          >
            <i className="bi bi-shop-window me-2"></i> Almacén Rural
          </Navbar.Brand>

          <button
            onClick={toggleMenu}
            className="btn btn-primary border-0 p-2 rounded-circle shadow-sm"
            style={{ width: "44px", height: "44px" }}
          >
            <i className="bi bi-list fs-3"></i>
          </button>
        </div>
      </Navbar>

      <Offcanvas show={show} onHide={() => setShow(false)} placement="end" style={{ width: "280px" }}>
        <Offcanvas.Header closeButton className="border-bottom pb-3 bg-primary text-white">
          <Offcanvas.Title className="fw-bold">
            <i className="bi bi-grid-3x3-gap-fill me-2"></i> Menú Principal
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="p-0 bg-white">
          <Nav className="flex-column w-100">
            {menuItems.map((item) => (
              <Nav.Link
                key={item.ruta}
                onClick={() => navegar(item.ruta)}
                className={`d-flex align-items-center justify-content-start px-4 py-3 ${
                  activo(item.ruta) ? "bg-primary text-white" : "text-dark"
                }`}
                style={{
                  cursor: "pointer",
                  fontWeight: activo(item.ruta) ? 600 : 500,
                  transition: "all 0.2s ease",
                }}
              >
                <i className={`bi ${item.icono} fs-4 me-3`} style={{ width: 30 }}></i>
                <span style={{ fontSize: "1.05rem" }}>{item.nombre}</span>
              </Nav.Link>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Encabezado;
