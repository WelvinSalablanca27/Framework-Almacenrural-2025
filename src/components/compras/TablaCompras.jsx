import { useState, useEffect } from "react";
import { Table, Card, Button, Spinner } from "react-bootstrap";
import Paginacion from "../ordenamiento/Paginacion";

const TablaCompras = ({
  compras = [],
  cargando = false,
  obtenerDetalles,
  abrirModalEdicion,
  abrirModalEliminacion,
  totalElementos = 0,
  elementosPorPagina = 5,
  paginaActual = 1,
  establecerPaginaActual,
}) => {
  const [esMovil, setEsMovil] = useState(window.innerWidth < 768);
  const [orden, setOrden] = useState({ campo: "id_compra", direccion: "asc" });

  // Detectar tamaño de ventana
  useEffect(() => {
    const handleResize = () => setEsMovil(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Manejar ordenamiento
  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };

  // Ordenar compras
  const comprasOrdenadas = [...compras].sort((a, b) => {
    const valorA = a[orden.campo];
    const valorB = b[orden.campo];
    if (typeof valorA === "number" && typeof valorB === "number") {
      return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
    }
    return orden.direccion === "asc"
      ? String(valorA).localeCompare(String(valorB))
      : String(valorB).localeCompare(String(valorA));
  });

  if (cargando) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2 text-muted">Cargando compras...</p>
      </div>
    );
  }

  if (compras.length === 0) {
    return (
      <p className="text-center text-muted py-5">No hay compras registradas.</p>
    );
  }

  // Total de páginas
  const totalPaginas = Math.ceil(totalElementos / elementosPorPagina);

  const handlePagina = (numero) => {
    if (numero < 1) numero = 1;
    if (numero > totalPaginas) numero = totalPaginas;
    establecerPaginaActual(numero);
  };

  // Generar números visibles (máx. 5)
  const generarPaginacion = () => {
    const paginas = [];
    let inicio = Math.max(1, paginaActual - 2);
    let fin = Math.min(totalPaginas, paginaActual + 2);
    for (let i = inicio; i <= fin; i++) paginas.push(i);
    return paginas;
  };

  if (esMovil) {
    // Modo móvil: tarjetas
    return (
      <>
        {comprasOrdenadas.map((c) => (
          <Card
            key={c.id_compra}
            className="mb-3 shadow-sm border-0"
            style={{ borderRadius: "16px", padding: "15px" }}
          >
            <h5 className="fw-bold text-success mb-2">Compra #{c.id_compra}</h5>
            <p className="mb-1" style={{ fontSize: "13px" }}>
              <strong>Proveedor:</strong> {c.nombre_proveedor}
            </p>
            <p className="mb-1" style={{ fontSize: "13px" }}>
              <strong>Fecha:</strong> {new Date(c.Fe_compra).toLocaleString()}
            </p>
            <div className="d-flex gap-2 mt-3 flex-wrap">
              <Button size="sm" variant="outline-info" onClick={() => obtenerDetalles(c.id_compra)}>🔍 Detalles</Button>
              <Button size="sm" variant="outline-warning" onClick={() => abrirModalEdicion(c)}>✏️ Editar</Button>
              <Button size="sm" variant="outline-danger" onClick={() => abrirModalEliminacion(c)}>🗑️ Eliminar</Button>
            </div>
          </Card>
        ))}

        <Paginacion
          elementosPorPagina={elementosPorPagina}
          totalElementos={totalElementos}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
        />
      </>
    );
  }

  // Modo escritorio: tabla
  return (
    <>
      <Table striped bordered hover responsive className="mt-3 text-center align-middle shadow-sm">
        <thead className="bg-success text-white">
          <tr>
            <th onClick={() => manejarOrden("id_compra")} style={{ cursor: "pointer" }}>
              ID {orden.campo === "id_compra" ? (orden.direccion === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => manejarOrden("nombre_proveedor")} style={{ cursor: "pointer" }}>
              Proveedor {orden.campo === "nombre_proveedor" ? (orden.direccion === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => manejarOrden("Fe_compra")} style={{ cursor: "pointer" }}>
              Fecha {orden.campo === "Fe_compra" ? (orden.direccion === "asc" ? "▲" : "▼") : ""}
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {comprasOrdenadas.map((c) => (
            <tr key={c.id_compra}>
              <td>{c.id_compra}</td>
              <td>{c.nombre_proveedor}</td>
              <td>{new Date(c.Fe_compra).toLocaleString()}</td>
              <td>
                <div className="d-flex gap-2 justify-content-center flex-wrap">
                  <Button size="sm" variant="outline-info" onClick={() => obtenerDetalles(c.id_compra)}>🔍 Detalles</Button>
                  <Button size="sm" variant="outline-warning" onClick={() => abrirModalEdicion(c)}>✏️ Editar</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => abrirModalEliminacion(c)}>🗑️ Eliminar</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Paginacion
        elementosPorPagina={elementosPorPagina}
        totalElementos={totalElementos}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />
    </>
  );
};

export default TablaCompras;
