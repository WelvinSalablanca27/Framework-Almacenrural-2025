import { useState } from "react";
import { Table, Spinner, Button, Card } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import BotonOrden from "../ordenamiento/BotonOrden";
import Paginacion from "../ordenamiento/Paginacion";

const TablaProducto = ({
  productos,
  cargando,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  const [orden, setOrden] = useState({ campo: "id_Producto", direccion: "asc" });
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const isMobile = useMediaQuery({ maxWidth: 767 });

  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
    setPaginaActual(1);
  };

  const productosOrdenados = [...productos].sort((a, b) => {
    const A = a[orden.campo] ?? "";
    const B = b[orden.campo] ?? "";
    if (typeof A === "number" && typeof B === "number") {
      return orden.direccion === "asc" ? A - B : B - A;
    }
    return orden.direccion === "asc"
      ? String(A).localeCompare(String(B))
      : String(B).localeCompare(String(A));
  });

  const totalElementos = productosOrdenados.length;
  const inicio = (paginaActual - 1) * elementosPorPagina;
  const productosPaginados = productosOrdenados.slice(inicio, inicio + elementosPorPagina);

  const formatearFecha = (f) => (f ? new Date(f).toLocaleDateString("es-NI") : "-");
  const formatearMoneda = (v) => `C$${(Number(v) || 0).toFixed(2)}`;

  if (cargando) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2 text-muted">Cargando productos...</p>
      </div>
    );
  }

  if (productos.length === 0) {
    return <p className="text-center text-muted fs-5">No hay productos registrados.</p>;
  }

  // VISTA MÓVIL - TARJETAS BLANCAS CON BORDE VERDE
  if (isMobile) {
    return (
      <div className="px-2">
        {/* SELECTOR DE ORDENAMIENTO */}
        <div className="mb-4">
          <select
            className="form-select form-select-sm shadow-sm"
            value={`${orden.campo}-${orden.direccion}`}
            onChange={(e) => {
              const [campo, direccion] = e.target.value.split("-");
              setOrden({ campo, direccion });
              setPaginaActual(1);
            }}
          >
            <option value="id_Producto-asc">ID (menor a mayor)</option>
            <option value="Nombre_Prod-asc">Nombre (A → Z)</option>
            <option value="Existencia_Prod-desc">Más Existencia</option>
            <option value="stock-desc">Más Stock</option>
            <option value="Precio_Venta-desc">Más Caro</option>
            <option value="Fe_caducidad-asc">Caduca Pronto</option>
          </select>
        </div>

        {/* PAGINACIÓN ARRIBA */}
        <div className="d-flex justify-content-center mb-4">
          <Paginacion
            elementosPorPagina={elementosPorPagina}
            totalElementos={totalElementos}
            paginaActual={paginaActual}
            establecerPaginaActual={setPaginaActual}
          />
        </div>

        {/* TARJETAS */}
        <div className="d-flex flex-column gap-4">
          {productosPaginados.map((p) => (
            <Card
              key={p.id_Producto}
              className="shadow-lg border-0"
              style={{
                borderRadius: "18px",
                background: "white",
                border: "3px solid #28a745",
              }}
            >
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="fw-bold text-success mb-1">#{p.id_Producto}</h5>
                    <h6 className="fw-bold text-dark">{p.Nombre_Prod}</h6>
                  </div>
                  <div className="d-grid gap-2">
                    <Button size="sm" variant="warning" onClick={() => abrirModalEdicion(p)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => abrirModalEliminacion(p)}>
                      Eliminar
                    </Button>
                  </div>
                </div>

                <hr className="border-success" />

                <div className="small">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Tipo:</span>
                    <span className="fw-bold text">{p.Tipo_Prod || "N/A"}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Existencia:</span>
                    <span className="fw-bold" style={{ color: "#1e7e34" }}>
                      {p.Existencia_Prod || p.stock || 0}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Stock:</span>
                    <span className="fw-bold" style={{ color: "#1e7e34" }}>
                      {p.stock || 0}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Costo:</span>
                    <span className="fw-bold text-secondary">{formatearMoneda(p.Precio_Costo)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Venta:</span>
                    <span className="fw-bold text-success">{formatearMoneda(p.Precio_Venta)}</span>
                  </div>
                  {p.Fe_caducidad && (
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Caducidad:</span>
                      <span className="fw-bold text-danger">{formatearFecha(p.Fe_caducidad)}</span>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* PAGINACIÓN ABAJO (opcional) */}
        <div className="mt-4 d-flex justify-content-center">
          <Paginacion
            elementosPorPagina={elementosPorPagina}
            totalElementos={totalElementos}
            paginaActual={paginaActual}
            establecerPaginaActual={setPaginaActual}
          />
        </div>
      </div>
    );
  }

  // VISTA ESCRITORIO (sin cambios)
  return (
    // ... tu tabla de escritorio igual que antes
    <div>
      <h5 className="mb-3 text-center text-success fw-bold">Lista de Productos</h5>
      <div style={{ overflowX: "auto", borderRadius: "10px" }}>
        <Table striped bordered hover className="table-sm text-center align-middle">
          <thead className="table-success text-white">
            <tr>
              <BotonOrden campo="id_Producto" orden={orden} manejarOrden={manejarOrden}>ID</BotonOrden>
              <BotonOrden campo="Nombre_Prod" orden={orden} manejarOrden={manejarOrden}>Nombre</BotonOrden>
              <BotonOrden campo="Tipo_Prod" orden={orden} manejarOrden={manejarOrden}>Tipo</BotonOrden>
              <BotonOrden campo="Existencia_Prod" orden={orden} manejarOrden={manejarOrden}>Existencia</BotonOrden>
              <BotonOrden campo="stock" orden={orden} manejarOrden={manejarOrden}>Stock</BotonOrden>
              <BotonOrden campo="Precio_Costo" orden={orden} manejarOrden={manejarOrden}>Costo</BotonOrden>
              <BotonOrden campo="Precio_Venta" orden={orden} manejarOrden={manejarOrden}>Venta</BotonOrden>
              <BotonOrden campo="Fe_caducidad" orden={orden} manejarOrden={manejarOrden}>Caducidad</BotonOrden>
              <th className="bg-success text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosPaginados.map((p) => (
              <tr key={p.id_Producto}>
                <td>{p.id_Producto}</td>
                <td>{p.Nombre_Prod}</td>
                <td>{p.Tipo_Prod || "-"}</td>
                <td>{p.Existencia_Prod || p.stock || 0}</td>
                <td>{p.stock || 0}</td>
                <td>{formatearMoneda(p.Precio_Costo)}</td>
                <td>{formatearMoneda(p.Precio_Venta)}</td>
                <td>{formatearFecha(p.Fe_caducidad)}</td>
                <td>
                  <div className="d-flex gap-1 justify-content-center">
                    <Button size="sm" variant="warning" onClick={() => abrirModalEdicion(p)}>Editar</Button>
                    <Button size="sm" variant="danger" onClick={() => abrirModalEliminacion(p)}>Eliminar</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="d-flex justify-content-center mt-3">
        <Paginacion
          elementosPorPagina={elementosPorPagina}
          totalElementos={totalElementos}
          paginaActual={paginaActual}
          establecerPaginaActual={setPaginaActual}
        />
      </div>
    </div>
  );
};

export default TablaProducto;76