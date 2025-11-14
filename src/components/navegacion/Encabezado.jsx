import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Offcanvas, Nav } from "react-bootstrap";

const Encabezado = ({ usuarioLogueado, manejarLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);

  const toggleMenu = () => setShow(!show);

  const navegar = (ruta) => {
    navigate(ruta);
    setShow(false); // cierra menú al hacer clic
  };

  const activo = (ruta) => location.pathname === ruta;

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
        <div className="container-fluid position-relative d-flex align-items-center px-3">

          {/* Flecha atrás estilo Google */}
          <span
            onClick={() => navigate(-1)}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              left: "20px",
              height: "100%",
              userSelect: "none",
              transition: "transform 0.2s, color 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="40"
              fill="white"
              viewBox="0 0 24 24"
              style={{ transition: "fill 0.2s" }}
            >
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </span>


          {/* Título centrado */}
          <Navbar.Brand
            onClick={() => navegar("/")}
            className="fw-bold text-white mx-auto text-center d-flex align-items-center justify-content-center"
            style={{
              cursor: "pointer",
              fontSize: "1.35rem",
            }}
          >
            <i className="bi bi-shop-window me-2 d-inline-block" style={{ fontSize: "1.35rem" }}></i>
            <span className="d-inline-block">Almacén Rural</span>
          </Navbar.Brand>

          {/* Botón de menú lateral */}
          <button
            onClick={toggleMenu}
            className="btn btn-primary border-0 p-2 rounded-circle shadow-sm position-absolute end-0"
            style={{ width: "44px", height: "44px" }}
          >
            <i className="bi bi-list fs-3"></i>
          </button>
        </div>

        {/* Estilos responsivos */}
        <style jsx>{`
          @media (max-width: 576px) {
            .navbar-brand span,
            .navbar-brand i {
              font-size: 1rem !important;
            }
          }
        `}</style>
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
                className={`d-flex align-items-center justify-content-start px-4 py-3 ${activo(item.ruta) ? "bg-primary text-white" : "text-dark"
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
