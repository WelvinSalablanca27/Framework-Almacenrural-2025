import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

const App = () => {
  // Inicializamos desde localStorage si existe
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => {
    const usuario = localStorage.getItem("usuarioLogueado");
    return usuario ? JSON.parse(usuario) : null;
  });

  const manejarLogout = () => {
    setUsuarioLogueado(null);
    localStorage.removeItem("usuarioLogueado");
  };

  // Guardar cambios de usuarioLogueado en localStorage
  useEffect(() => {
    if (usuarioLogueado) {
      localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioLogueado));
    }
  }, [usuarioLogueado]);

  return (
    <Router>
      {usuarioLogueado && (
        <Encabezado
          usuarioLogueado={usuarioLogueado}
          manejarLogout={manejarLogout}
        />
      )}

      <main className="margen-superior-main">
        <Routes>
          {!usuarioLogueado ? (
            <Route
              path="*"
              element={<Login setUsuarioLogueado={setUsuarioLogueado} />}
            />
          ) : (
            <>
              <Route path="/" element={<Inicio />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/cliente" element={<Cliente />} />
              <Route path="/venta" element={<Venta />} />
              <Route path="/compra" element={<Compra />} />
              <Route path="/proveedor" element={<Proveedor />} />
              <Route path="/producto" element={<Producto />} />
              <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
            </>
          )}
        </Routes>
      </main>
    </Router>
  );
};

export default App;
