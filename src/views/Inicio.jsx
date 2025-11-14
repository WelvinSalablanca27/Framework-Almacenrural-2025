import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaUserCog,
  FaBoxOpen,
  FaTruck,
  FaCashRegister,
  FaShoppingCart,
  FaSignOutAlt
} from "react-icons/fa";

const secciones = [
  { nombre: "Cliente", color: "#0d6efd", icono: FaUsers, ruta: "/cliente", descripcion: "Gestionar información de clientes." },
  { nombre: "Usuario", color: "#6f42c1", icono: FaUserCog, ruta: "/usuario", descripcion: "Administrar cuentas de usuario." },
  { nombre: "Producto", color: "#fd7e14", icono: FaBoxOpen, ruta: "/producto", descripcion: "Ver y registrar productos disponibles." },
  { nombre: "Proveedor", color: "#20c997", icono: FaTruck, ruta: "/proveedor", descripcion: "Gestionar proveedores y suministros." },
  { nombre: "Venta", color: "#dc3545", icono: FaCashRegister, ruta: "/venta", descripcion: "Registrar y consultar ventas realizadas." },
  { nombre: "Compra", color: "#ffc107", icono: FaShoppingCart, ruta: "/compra", descripcion: "Registrar compras y administrar inventario." },
];

const fondoalmacenrural = "https://i.pinimg.com/736x/76/fb/4a/76fb4a687980c6b31824bc0752d66f10.jpg";

const Inicio = ({ setUsuarioLogueado }) => {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    if (window.confirm("¿Desea cerrar sesión?")) {
      setUsuarioLogueado(null); // Limpiar estado del usuario
      localStorage.removeItem("usuarioLogueado"); // Si usas localStorage
      navigate("/login"); // Redirigir al login
    }
  };

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
        overflow: "auto",
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
          padding: "15px",
        }}
      >
        {/* Tarjeta de bienvenida compacta */}
        <Card
          style={{
            background: "rgba(255, 255, 255, 0.88)",
            borderRadius: "15px",
            padding: "15px",
            maxWidth: "350px",
            width: "100%",
            textAlign: "center",
            marginBottom: "20px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
            border: "1px solid rgba(255,255,255,0.5)",
            backdropFilter: "blur(4px)",
          }}
        >
          <h5 className="fw-bold" style={{ color: "#198754" }}>
            ¡Bienvenido al Sistema Almacén Rural!
          </h5>
          <p style={{ color: "#333", fontSize: "0.9rem", marginTop: "8px" }}>
            Seleccione una sección para comenzar. Aquí podrá gestionar clientes, usuarios, productos, proveedores, ventas y compras.
          </p>
        </Card>

        {/* Secciones */}
        <Row className="g-2 justify-content-center" style={{ width: "100%" }}>
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
                      borderRadius: "12px",
                      width: "100%",
                      padding: "10px",
                      background: "rgba(255,255,255,0.95)",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "100px",
                      fontSize: "0.85rem",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0) scale(1)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                    }}
                  >
                    <Icon size={35} color={sec.color} className="mb-1" />
                    <span className="fw-bold" style={{ color: "#222" }}>
                      {sec.nombre}
                    </span>
                    <p style={{ fontSize: "0.7rem", color: "#555", marginTop: "4px" }}>
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