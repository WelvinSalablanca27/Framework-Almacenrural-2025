import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Encabezado from "./components/navegacion/Encabezado";

import Inicio from "./views/Inicio";
import Login from "./views/Login";
import Usuarios from "./views/Usuarios";
import Cliente from "./views/Cliente";
import Venta from "./views/Venta";
import Compra from "./views/Compra";
import Proveedor from "./views/Proveedor";
import Producto from "./views/Producto";

import "./App.css";


// ========================================
//   RUTAS (con protección y carga inicial)
// ========================================
const AppRutas = ({ usuarioLogueado, setUsuarioLogueado }) => {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true); // <-- evita parpadeos

  // Validar sesión solo una vez al cargar la app
  useEffect(() => {
    const usuario = localStorage.getItem("usuarioLogueado");

    if (usuario) {
      setUsuarioLogueado(JSON.parse(usuario));
      navigate("/", { replace: true }); // siempre Inicio
    }

    // Termina carga y habilita rutas
    setTimeout(() => setCargando(false), 150);
  }, []);

  // Cerrar sesión profesional
  const manejarLogout = () => {
    localStorage.removeItem("usuarioLogueado");
    setUsuarioLogueado(null);
    navigate("/login", { replace: true });
  };

  // ============================
  //  Pantalla blanca mientras carga
  // ============================
  if (cargando) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#fff",
        }}
      ></div>
    );
  }

  return (
    <>
      {usuarioLogueado && (
        <Encabezado
          usuarioLogueado={usuarioLogueado}
          manejarLogout={manejarLogout}
        />
      )}

      <main className="margen-superior-main">
        <Routes>
          {!usuarioLogueado ? (
            <>
              <Route path="/login" element={<Login setUsuarioLogueado={setUsuarioLogueado} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Inicio />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/cliente" element={<Cliente />} />
              <Route path="/venta" element={<Venta />} />
              <Route path="/compra" element={<Compra />} />
              <Route path="/proveedor" element={<Proveedor />} />
              <Route path="/producto" element={<Producto />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </main>
    </>
  );
};


// ============================
//      APP PRINCIPAL
// ============================
const App = () => {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  return (
    <Router>
      <AppRutas usuarioLogueado={usuarioLogueado} setUsuarioLogueado={setUsuarioLogueado} />
    </Router>
  );
};

export default App;
