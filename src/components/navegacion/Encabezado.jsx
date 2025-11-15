import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Offcanvas, Nav, Button } from "react-bootstrap";

const Encabezado = ({ usuarioLogueado, manejarLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);

  const toggleMenu = () => setShow(!show);
  const navegar = (ruta) => { navigate(ruta); setShow(false); };
  const activo = (ruta) => location.pathname === ruta;

  // Si no hay usuario logueado o estamos en login, no mostramos nada
  if (!usuarioLogueado || location.pathname === "/login") return null;

  // Menú completo
  const menuItems = [
    { ruta: "/", icono: "bi-house-door-fill", nombre: "Inicio" },
    { ruta: "/usuarios", icono: "bi-people-fill", nombre: "Usuarios" },
    { ruta: "/cliente", icono: "bi-person-circle", nombre: "Cliente" },
    { ruta: "/producto", icono: "bi-box-seam-fill", nombre: "Producto" },
    { ruta: "/proveedor", icono: "bi-truck", nombre: "Proveedor" },
    { ruta: "/venta", icono: "bi-graph-up-arrow", nombre: "Venta" },
    { ruta: "/compra", icono: "bi-cart-fill", nombre: "Compra" },
  ];

  // Filtrar menú según rol
  let menuFiltrado = menuItems;
  if (usuarioLogueado?.rol === "cajero") {
    menuFiltrado = menuItems.filter(
      (item) => item.ruta === "/producto" || item.ruta === "/venta" || item.ruta === "/cliente"
    );
  }

  // Mostrar flecha solo si NO estamos en el inicio
  const mostrarFlecha = location.pathname !== "/";

  return (
    <>
      <Navbar bg="primary" variant="dark" fixed="top" className="shadow-sm" style={{ height: "56px" }}>
        <div className="container-fluid position-relative d-flex align-items-center px-3">
          {mostrarFlecha && (
            <span
              onClick={() => navigate(-1)}
              style={{ cursor: "pointer", position: "absolute", left: "20px", height: "100%" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="40" fill="white" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </span>
          )}

          <Navbar.Brand
            onClick={() => navegar("/")}
            className="fw-bold text-white mx-auto text-center"
            style={{ cursor: "pointer", fontSize: "1.35rem" }}
          >
            <i className="bi bi-shop-window me-2"></i>
            Almacén Rural
          </Navbar.Brand>

          <button
            onClick={toggleMenu}
            className="btn btn-primary border-0 p-2 rounded-circle position-absolute end-0"
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

        <Offcanvas.Body className="p-0 bg-white d-flex flex-column justify-content-between" style={{ height: "100%" }}>
          <div>
            <Nav className="flex-column w-100">
              {menuFiltrado.map((item) => (
                <Nav.Link
                  key={item.ruta}
                  onClick={() => navegar(item.ruta)}
                  className={`d-flex align-items-center px-4 py-3 ${activo(item.ruta) ? "bg-primary text-white" : "text-dark"}`}
                  style={{ cursor: "pointer", fontWeight: activo(item.ruta) ? 600 : 500 }}
                >
                  <i className={`bi ${item.icono} fs-4 me-3`} style={{ width: 30 }}></i>
                  <span>{item.nombre}</span>
                </Nav.Link>
              ))}
            </Nav>
          </div>

          <div className="px-3 pb-3">
            <Button variant="danger" className="w-100" onClick={manejarLogout}>
              <i className="bi bi-box-arrow-right"></i> Cerrar sesión
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Encabezado;
