import React, { useState, useEffect } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Datos de usuarios
const usuarioAdmin = {
  nombre: "Administrador",
  correo: "admin@vh.com",
  telefono: "84188486",
  password: "SistemaRural2025!",
  rol: "administrador",
};

const usuarioCajero = {
  nombre: "Cajero",
  correo: "cajero@correo.com",
  telefono: "57136228",
  password: "Cajero@2025",
  rol: "cajero",
};

// Fondo
const fondoalmacenrural = "https://i.pinimg.com/736x/76/fb/4a/76fb4a687980c6b31824bc0752d66f10.jpg";

const Login = ({ setUsuarioLogueado }) => {
  const navigate = useNavigate();
  const [usuarioInput, setUsuarioInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const manejarLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const esAdmin =
        (usuarioInput === usuarioAdmin.correo || usuarioInput === usuarioAdmin.telefono) &&
        password === usuarioAdmin.password;

      const esCajero =
        (usuarioInput === usuarioCajero.correo || usuarioInput === usuarioCajero.telefono) &&
        password === usuarioCajero.password;

      if (esAdmin || esCajero) {
        const usuarioLogueado = esAdmin ? usuarioAdmin : usuarioCajero;
        setUsuarioLogueado(usuarioLogueado);
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioLogueado));
        navigate("/", { replace: true });
      } else {
        setError("Usuario o contraseña incorrectos.");
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        padding: "10px",
      }}
    >
      {/* TARJETA GLASSMORPHISM */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(30,120,230,0.88) 0%, rgba(0,150,136,0.82) 100%)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: "32px",
          boxShadow: `
            0 20px 50px rgba(0,0,0,0.35),
            0 0 30px rgba(0,150,136,0.25),
            inset 0 0 20px rgba(255,255,255,0.1)
          `,
          overflow: "hidden",
          maxWidth: "1100px",
          width: "88%",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          minHeight: isMobile ? "auto" : "660px",
          position: "relative",
          transition: "all 0.3s ease",
        }}
      >
        {/* Brillos sutiles en esquinas */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "350px",
            height: "350px",
            background:
              "radial-gradient(circle at bottom right, rgba(255,255,255,0.15), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* FORMULARIO */}
        <div
          style={{
            flex: 1,
            padding: isMobile ? "40px 20px" : "60px 50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          {isMobile && (
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img
                src={fondoalmacenrural}
                alt="logo"
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "15px",
                  objectFit: "cover",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                }}
              />
            </div>
          )}

          <div style={{ textAlign: "center", marginBottom: "35px" }}>
            <h2 style={{ fontWeight: "700", color: "#ffffff", margin: 0 }}>Bienvenido</h2>
            <h4 style={{ fontWeight: "500", color: "#e0f7fa", marginTop: "5px" }}>
              Veterinaria Almacén Rural
            </h4>
          </div>

          {error && (
            <div
              style={{
                background: "#f8d7da",
                color: "#842029",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <Form onSubmit={manejarLogin} style={{ width: "100%", maxWidth: "350px" }}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#ffffff" }}>Correo o Teléfono</Form.Label>
              <Form.Control
                type="text"
                list="usuariosDisponibles"
                value={usuarioInput}
                onChange={(e) => setUsuarioInput(e.target.value)}
                required
                placeholder="E-mail o teléfono"
                style={{ borderRadius: "10px", border: "1px solid #ced4da", height: "45px" }}
              />
              <datalist id="usuariosDisponibles">
                <option value={usuarioAdmin.correo} />
                <option value={usuarioAdmin.telefono} />
                <option value={usuarioCajero.correo} />
                <option value={usuarioCajero.telefono} />
              </datalist>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#ffffff" }}>Contraseña</Form.Label>
              <Form.Control
                type={mostrarPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Contraseña"
                style={{ borderRadius: "10px", border: "1px solid #ced4da", height: "45px" }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                label="Mostrar contraseña"
                checked={mostrarPassword}
                onChange={() => setMostrarPassword(!mostrarPassword)}
                style={{ color: "#ffffff" }}
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100"
              disabled={loading}
              style={{
                padding: "12px 0",
                fontWeight: "700",
                backgroundColor: "#00bfa5",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                transition: "0.3s",
              }}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Ingresar"}
            </Button>
          </Form>

          <div
            style={{
              marginTop: "20px",
              fontSize: "0.85rem",
              textAlign: "center",
              color: "#b2dfdb",
            }}
          >
            Acceso seguro • Solo personal autorizado
          </div>
        </div>

        {/* LOGO ESCRITORIO */}
        {!isMobile && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
              zIndex: 1,
            }}
          >
            <img
              src={fondoalmacenrural}
              alt="VET'S Total Service"
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "20px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
