import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//Importar componente Encabezado.
import Encabezado from "./components/navegacion/Encabezado";

//Importar las vistas.
import Inicio from "./views/Inicio";
import Login from "./views/Login";
import Usuarios from "./views/Usuarios";
import Cliente from "./views/Cliente";
import Venta from "./views/Venta";
import Compra from "./views/Compra";

import Proveedor from "./views/Proveedor";
import Producto from "./views/Producto";


//Importar archivo de estilos.
import "./App.css";

const App = () =>{
  return (
    <Router>
      <Encabezado />a
      <main className="margen-superior-main">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Usuarios" element={<Usuarios />} />
          <Route path="/cliente" element={<Cliente />} />
          <Route path="/venta" element={<Venta />} />
          <Route path="/compra" element={<Compra />} />
          <Route path="/proveedor" element={<Proveedor />} />
          <Route path="/producto" element={<Producto />} />
          <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
        </Routes>
      </main>
    </Router>
  );
}
export default App;