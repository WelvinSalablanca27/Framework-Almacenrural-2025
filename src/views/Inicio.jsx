import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaUsers, FaUserCog, FaBoxOpen, FaTruck, FaCashRegister, FaShoppingCart } from "react-icons/fa";


const secciones = [
  { nombre: "Cliente", colorCajero: "#38bdf8", colorAdmin: "#38bdf8", icono: FaUsers, ruta: "/cliente", descripcion: "Gestionar información de clientes." },
  { nombre: "Usuario", colorCajero: "#2563eb", colorAdmin: "#2563eb", icono: FaUserCog, ruta: "/usuarios", descripcion: "Administrar cuentas de usuario." },
  { nombre: "Producto", colorCajero: "#22c55e", colorAdmin: "#22c55e", icono: FaBoxOpen, ruta: "/producto", descripcion: "Ver y registrar productos disponibles." },
  { nombre: "Proveedor", colorCajero: "#f97316", colorAdmin: "#f97316", icono: FaTruck, ruta: "/proveedor", descripcion: "Gestionar proveedores y suministros." },
  { nombre: "Venta", colorCajero: "#ef4444", colorAdmin: "#ef4444", icono: FaCashRegister, ruta: "/venta", descripcion: "Registrar y consultar ventas realizadas." },
  { nombre: "Compra", colorCajero: "#1e3a8a", colorAdmin: "#1e3a8a", icono: FaShoppingCart, ruta: "/compra", descripcion: "Registrar compras y administrar inventario." },
];

// Fondo global
const fondoalmacenrural = "https://i.pinimg.com/736x/76/fb/4a/76fb4a687980c6b31824bc0752d66f10.jpg";

const Inicio = () => {
  const rol = JSON.parse(localStorage.getItem("usuarioLogueado"))?.rol || "cajero";

  const seccionesFiltradas = secciones.filter((sec) =>
    rol === "cajero" ? ["Cliente", "Producto", "Venta"].includes(sec.nombre) : true
  );

  const mensajeBienvenida =
    rol === "cajero"
      ? "¡Bienvenido, Cajero! Gestione clientes, productos y ventas."
      : "¡Bienvenido, Administrador! Controle todas las áreas del sistema.";

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${fondoalmacenrural})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "auto",
      }}
    >
      {/* Overlay sutil */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.05)",
          zIndex: 0,
        }}
      />

      <Container
        style={{
          position: "relative",
          zIndex: 1,
          padding: "20px",
          maxWidth: "1200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Tarjeta de bienvenida con color nice */}
        <Card
          style={{
            background: "linear-gradient(135deg, #4ade80, #06b6d4)", 
            color: "white",
            borderRadius: "15px",
            padding: "18px",
            maxWidth: "450px",
            width: "100%",
            textAlign: "center",
            marginBottom: "25px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
          }}
        >
          <h5 className="fw-bold">{mensajeBienvenida}</h5>
        </Card>

        {/* Tarjetas de secciones */}
        <Row className="g-3 justify-content-center" style={{ width: "100%" }}>
          {seccionesFiltradas.map((sec, idx) => {
            const Icon = sec.icono;
            const colorTarjeta = rol === "cajero" ? sec.colorCajero : sec.colorAdmin;

            return (
              <Col key={idx} xs={6} sm={4} md={3} lg={3} className="d-flex justify-content-center">
                <Link to={sec.ruta} style={{ textDecoration: "none", width: "100%" }}>
                  <Card
                    style={{
                      borderRadius: "16px",
                      width: "100%",
                      height: "160px",
                      padding: "15px",
                      background: colorTarjeta,
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      transition: "all 0.23s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px) scale(1.05)";
                      e.currentTarget.style.boxShadow = "0 12px 22px rgba(0,0,0,0.30)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0) scale(1)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                    }}
                  >
                    <Icon size={40} className="mb-2" />
                    <span className="fw-bold" style={{ fontSize: "1rem" }}>
                      {sec.nombre}
                    </span>
                    <p style={{ fontSize: "0.75rem", marginTop: "6px", opacity: 0.9 }}>
                      {sec.descripcion}
                    </p>
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
