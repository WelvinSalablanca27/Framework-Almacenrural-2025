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

  // ORDENAMIENTO
  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
    setPaginaActual(1);
  };

  const productosOrdenados = [...productos].sort((a, b) => {
    const A = a[orden.campo];
    const B = b[orden.campo];
    if (typeof A === "number" && typeof B === "number") {
      return orden.direccion === "asc" ? A - B : B - A;
    }
    return orden.direccion === "asc"
      ? String(A).localeCompare(String(B))
      : String(B).localeCompare(String(A));
  });

  // PAGINACIÓN
  const totalElementos = productosOrdenados.length;
  const inicio = (paginaActual - 1) * elementosPorPagina;
  const productosPaginados = productosOrdenados.slice(inicio, inicio + elementosPorPagina);

  
  const formatearFecha = (f) => new Date(f).toLocaleDateString("es-NI");
  const formatearMoneda = (v) => `C$${Number(v).toFixed(2)}`;

  if (cargando) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2 text-muted">Cargando productos...</p>
      </div>
    );
  }

  if (productos.length === 0) {
    return <p className="text-center text-muted">No hay productos registrados.</p>;
  }

  // VISTA MÓVIL
  if (isMobile) {
    return (
      <div>
        <h5 className="mb-3 text-center text-success fw-bold">
          Lista de Productos
        </h5>


        <div className="mb-3">
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
            <option value="id_Producto-desc">ID (mayor a menor)</option>
            <option value="Nombre_Prod-asc">Nombre (A → Z)</option>
            <option value="Nombre_Prod-desc">Nombre (Z → A)</option>
            <option value="Existencia_Prod-desc">Existencia (más stock)</option>
            <option value="stock-desc">Stock (más)</option>
            <option value="Precio_Venta-desc">Precio Venta (más caro)</option>
            <option value="Fe_caducidad-asc">Caducidad (próxima)</option>
          </select>
        </div>


        <div className="d-flex flex-column gap-3">
          {productosPaginados.map((p) => (
            <Card
              key={p.id_Producto}
              className="shadow-sm border-0"
              style={{
                borderRadius: "15px",
                background: "rgba(255, 255, 255, 0.97)",
                border: "2px solid #0a8a28ff",
              }}
            >
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <div className="fw-bold text-success fs-5">#{p.id_Producto}</div>
                    <div className="fw-bold text-dark">{p.Nombre_Prod}</div>
                  </div>
                  <div className="d-grid gap-1">
                    <Button size="sm" variant="warning" onClick={() => abrirModalEdicion(p)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => abrirModalEliminacion(p)}>
                      Eliminar
                    </Button>
                  </div>
                </div>

                <hr className="my-2 border-success" />

                <div className="small">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Tipo:</span>
                    <span className="fw-bold">{p.Tipo_Prod}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Existencia:</span>
                    <span className="fw-bold text-primary">{p.Existencia_Prod}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Stock:</span>
                    <span className="fw-bold text-primary">{p.stock}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Costo:</span>
                    <span className="fw-bold text-success">{formatearMoneda(p.Precio_Costo)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Venta:</span>
                    <span className="fw-bold text-success">{formatearMoneda(p.Precio_Venta)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Caducidad:</span>
                    <span className="fw-bold text-danger">{formatearFecha(p.Fe_caducidad)}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>


        <div className="mt-4">
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

  // VISTA ESCRITORIO
  return (
    <div>
      <h5 className="mb-3 text-center text-success fw-bold">
        Lista de Productos
      </h5>

      <div style={{ overflowX: "auto", borderRadius: "10px" }}>
        <Table striped bordered hover className="table-sm text-center align-middle">
          <thead className="table-success text-white">
            <tr>
              <BotonOrden campo="id_Producto" orden={orden} manejarOrden={manejarOrden}>ID</BotonOrden>
              <BotonOrden campo="Nombre_Prod" orden={orden} manejarOrden={manejarOrden}>Nombre</BotonOrden>
              <BotonOrden campo="Tipo_Prod" orden={orden} manejarOrden={manejarOrden}>Tipo</BotonOrden>
              <BotonOrden campo="Existencia_Prod" orden={orden} manejarOrden={manejarOrden}>Existencia</BotonOrden>
              <BotonOrden campo="stock" orden={orden} manejarOrden={manejarOrden}>Stock</BotonOrden>
              <BotonOrden campo="Precio_Costo" orden={orden} manejarOrden={manejarOrden}>Precio Costo</BotonOrden>
              <BotonOrden campo="Precio_Venta" orden={orden} manejarOrden={manejarOrden}>Precio Venta</BotonOrden>
              <BotonOrden campo="Fe_caducidad" orden={orden} manejarOrden={manejarOrden}>Caducidad</BotonOrden>
              <th className="bg-success text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosPaginados.map((p) => (
              <tr key={p.id_Producto}>
                <td>{p.id_Producto}</td>
                <td>{p.Nombre_Prod}</td>
                <td>{p.Tipo_Prod}</td>
                <td>{p.Existencia_Prod}</td>
                <td>{p.stock}</td>
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

export default TablaProducto;