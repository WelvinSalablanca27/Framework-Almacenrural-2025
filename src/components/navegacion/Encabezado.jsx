import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";

const Encabezado = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const navigate = useNavigate();

  // Alternar visibilidad del menú
  const manejarToggle = () => setMostrarMenu(!mostrarMenu);

  // Navegar y cerrar menú
  const manejarNavegacion = (ruta) => {
    navigate(ruta);
    setMostrarMenu(false);
  };

  return (
    <Navbar expand="md" fixed="top" className="bg-primary">
      <Container>
        <Navbar.Brand
          onClick={() => manejarNavegacion("/inicio")}
          className="text-white fw-bold"
          style={{ cursor: "pointer" }}
        >
          Almacen-rural
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="menu-offcanvas"
          onClick={manejarToggle}
          className="bg-light"
        />
        <Navbar.Offcanvas
          id="menu-offcanvas"
          placement="end"
          show={mostrarMenu}
          onHide={() => setMostrarMenu(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menú principal</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-grow-1 pe-3">
              <Nav.Link
                className={mostrarMenu ? "text-danger" : "text-white"}
                onClick={() => manejarNavegacion("/")}
              >
                {mostrarMenu ? <i className="bi-house-fill me-2 "></i> : null} inicio
              </Nav.Link>

              <Nav.Link
                className={mostrarMenu ? "texto-marca2" : "text-white"}
                onClick={() => manejarNavegacion("/usuario")}
              >
                {mostrarMenu ? <i className="bi-people-fill me-2 "></i> : null} Usuarios
              </Nav.Link>

              <Nav.Link
                className={mostrarMenu ? "texto-marca2" : "text-white"}
                onClick={() => manejarNavegacion("/cliente")}
              >
                {mostrarMenu ? <i className="bi-person-circle me-2 "></i> : null} Cliente
              </Nav.Link>

              <Nav.Link
                className={mostrarMenu ? "texto-marca2" : "text-white"}
                onClick={() => manejarNavegacion("/venta")}
              >
                {mostrarMenu ? <i className="bi-graph-up-arrow me-2 "></i> : null} Venta
              </Nav.Link>

              <Nav.Link
                className={mostrarMenu ? "texto-marca2" : "text-white"}
                onClick={() => manejarNavegacion("/compra")}
              >
                {mostrarMenu ? <i className="bi-basket-fill me-2  "></i> : null} Compra
              </Nav.Link>

              <Nav.Link
                className={mostrarMenu ? "texto-marca2" : "text-white"}
                onClick={() => manejarNavegacion("/proveedor")}
              > 
               {mostrarMenu ? <i className="bi-truck-front-fill "></i> : null} proveedor
              </Nav.Link>

              <Nav.Link
                className={mostrarMenu ? "texto-marca2" : "text-white"}
                onClick={() => manejarNavegacion("/Producto")}
              >
                {mostrarMenu ? <i className="bi-box-fill me-2 "></i> : null} Producto
                
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};
export default Encabezado;