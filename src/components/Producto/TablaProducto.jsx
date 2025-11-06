import { useState } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";
import Paginacion from "../ordenamiento/Paginacion";

const TablaProductos = ({
  productos,
  cargando,
  abrirModalEdicion,
  abrirModalEliminacion,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
}) => {
  const [orden, setOrden] = useState({ campo: "id_Producto", direccion: "asc" });

  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };

  const productosOrdenados = [...productos].sort((a, b) => {
    const valorA = a[orden.campo];
    const valorB = b[orden.campo];

    if (typeof valorA === "number" && typeof valorB === "number") {
      return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
    }

    const comparacion = String(valorA).localeCompare(String(valorB));
    return orden.direccion === "asc" ? comparacion : -comparacion;
  });

  if (cargando)
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
    );

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <BotonOrden campo="id_Producto" orden={orden} manejarOrden={manejarOrden}>
              ID
            </BotonOrden>
            <BotonOrden campo="Nombre_Prod" orden={orden} manejarOrden={manejarOrden}>
              Nombre
            </BotonOrden>
            <BotonOrden campo="Tipo_Prod" orden={orden} manejarOrden={manejarOrden}>
              Tipo
            </BotonOrden>
            <BotonOrden campo="Existencia_Prod" orden={orden} manejarOrden={manejarOrden}>
              Existencia
            </BotonOrden>
            <BotonOrden campo="Precio_Costo" orden={orden} manejarOrden={manejarOrden}>
              Precio Costo
            </BotonOrden>
            <BotonOrden campo="Precio_Venta" orden={orden} manejarOrden={manejarOrden}>
              Precio Venta
            </BotonOrden>
            <BotonOrden campo="Fe_caducidad" orden={orden} manejarOrden={manejarOrden}>
              Fecha Caducidad
            </BotonOrden>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosOrdenados.map((producto) => (
            <tr key={producto.id_Producto}>
              <td>{producto.id_Producto}</td>
              <td>{producto.Nombre_Prod}</td>
              <td>{producto.Tipo_Prod}</td>
              <td>{producto.Existencia_Prod}</td>
              <td>{producto.Precio_Costo}</td>
              <td>{producto.Precio_Venta}</td>
              <td>{producto.Fe_caducidad}</td>
              <td>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(producto)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(producto)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
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

export default TablaProductos;
