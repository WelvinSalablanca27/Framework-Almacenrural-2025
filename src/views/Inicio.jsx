import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaUserCog,
  FaBoxOpen,
  FaTruck,
  FaCashRegister,
  FaShoppingCart,
} from "react-icons/fa";

const secciones = [
  { nombre: "Cliente", color: "#0d6efd", icono: FaUsers, ruta: "/cliente" },
  { nombre: "Usuario", color: "#6f42c1", icono: FaUserCog, ruta: "/usuario" },
  { nombre: "Producto", color: "#fd7e14", icono: FaBoxOpen, ruta: "/producto" },
  { nombre: "Proveedor", color: "#20c997", icono: FaTruck, ruta: "/proveedor" },
  { nombre: "Venta", color: "#dc3545", icono: FaCashRegister, ruta: "/venta" },
  { nombre: "Compra", color: "#ffc107", icono: FaShoppingCart, ruta: "/compra" },
];

const fondoalmacenrural =
  "https://i.pinimg.com/736x/76/fb/4a/76fb4a687980c6b31824bc0752d66f10.jpg";

const Inicio = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${fondoalmacenrural})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      {/* Capa semitransparente con blur */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(4px)",
          zIndex: 0,
        }}
      ></div>

      {/* Contenido */}
      <Container
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1
          className="fw-bold mb-4 text-center"
          style={{
            fontSize: "2.5rem",
            color: "#47ff78ff",
            textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          Veterinaria Almacén Rural
        </h1>

        <Row className="g-3 justify-content-center">
          {secciones.map((sec, idx) => {
            const Icon = sec.icono;
            return (
              <Col
                key={idx}
                xs={6}
                sm={4}
                md={3}
                lg={2}
                className="d-flex justify-content-center"
              >
                <Link to={sec.ruta} style={{ textDecoration: "none", width: "100%" }}>
                  <Card
                    className="text-center shadow"
                    style={{
                      borderRadius: "15px",
                      width: "100%",
                      padding: "15px",
                      background: "rgba(255,255,255,0.95)",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "100px",
                      boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px) scale(1.05)";
                      e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0) scale(1)";
                      e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
                    }}
                  >
                    <Icon size={45} color={sec.color} className="mb-2" />
                    <h6 className="fw-bold" style={{ color: "#222" }}>
                      {sec.nombre}
                    </h6>
                  </Card>
                </Link>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
};

export default Inicio;
