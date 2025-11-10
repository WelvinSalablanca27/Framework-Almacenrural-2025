import { useState, useEffect } from "react";
import TablaVentas from "../components/Venta/TablaVenta";
import { Container, Col, Row, Button } from "react-bootstrap";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroVenta from "../components/Venta/ModalRegistrarVenta";

const Venta = () => {
  const [venta, setVenta] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaVenta, setNuevaVenta] = useState({
    id_cliente: "",
    Fe_venta: "",
  });

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaVenta((prev) => ({ ...prev, [name]: value }));
  };

  const agregarVenta = async () => {
    if (
      !nuevaVenta.id_cliente.trim() ||
      !nuevaVenta.Fe_venta.trim()
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const respuesta = await fetch("http://localhost:3000/api/registrarventa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaVenta),
      });

      if (!respuesta.ok) throw new Error("Error al guardar la venta");

      // Limpiar y cerrar
      setNuevaVenta({
        id_cliente: "",
        Fe_venta: "",
      });
      setMostrarModal(false);
      await obtenerVentas(); // Refresca la lista
    } catch (error) {
      console.error("Error al agregar la venta:", error);
      alert("No se pudo guardar la venta. Revisa la consola.");
    }
  };

  const obtenerVentas = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/venta");

      if (!respuesta.ok) throw new Error("Error al obtener las ventas");

      const datos = await respuesta.json();
      setVentas(datos);
      setVentasFiltradas(datos);
      setCargando(false);
    } catch (error) {
      console.error(error.message);
      setCargando(false);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    const filtradas = venta.filter(
      (venta) =>
        venta.id_cliente == texto ||
        venta.Fe_venta == texto
    );

    setVentasFiltradas(filtradas);
  };

  useEffect(() => {
    obtenerVentas();
  }, []);

  return (
    <Container className="mt-4">
      <h4>Venta</h4>
      <Row>
        <Col lg={5} md={6} sm={8} xs={7}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => setMostrarModal(true)}>
            + Nueva Venta
          </Button>
        </Col>
      </Row>

      <TablaVentas venta={ventasFiltradas} cargando={cargando} />
      <ModalRegistroVenta
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaVenta={nuevaVenta}
        manejarCambioInput={manejarCambioInput}
        agregarVenta={agregarVenta}
      />
    </Container>
  );
};

export default Venta;
