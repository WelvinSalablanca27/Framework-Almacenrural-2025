import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//Importar componente Encabezado.
import Encabezado from "./componentes/navegacion/Encabezado";

//Importar las vistas.
import Inicio from "./views/Inicio";
import Login from "./views/Login";
import Usuario from "./views/Usuario";
import Cliente from "./views/Cliente";
import Venta from "./views/Venta";
import Compra from "./views/Compra";
import Producto from "./views/Producto";
import Proveedor from "./views/Proveedor";

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
          <Route path="/usuario" element={<Usuario />} />
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