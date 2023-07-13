import { BsCart2, BsTags } from "react-icons/bs";
import CardElement from "../../components/CardElement/CardElement";
import { Stack, Heading } from "@chakra-ui/react";
import { PiPackage } from "react-icons/pi";

function HomePage() {
  const vistas = [
    {
      title: "Productos",
      desc: [
        "Ver los productos en stock.",
        "Agregar un producto nuevo.",
        "Modificar un producto.",
      ],
      icon: PiPackage,
      url: "/productos",
    },
    {
      title: "Ventas",
      desc: ["Ver todas las ventas realizadas.", "Registrar una venta nueva."],
      icon: BsTags,
      url: "/ventas",
    },
    {
      title: "Compras",
      desc: [
        "Ver todas las compras realizadas.",
        "Registrar una compra nueva.",
      ],
      icon: BsCart2,
      url: "/compras",
    },
  ];

  const tarjetas = vistas.map((v) => {
    return <CardElement {...v} key={v.title} />;
  });

  return (
    <>
      <div className="header" style={{ textAlign: "center" }}>
        <Heading style={{ fontSize: "3rem" }}>
          Bienvenido al Sistema de Gestión
        </Heading>
      </div>
      <div
        className="row"
        style={{
          margin: "10px",
          display: "flex",
          justifyContent: "center",
          marginTop: "3rem",
        }}
      >
        <Stack
          flexGrow="1"
          direction={{ base: "column", sm: "row" }}
          height="fit-content"
          justify="center"
          align="center"
          spacing="30px"
        >
          {tarjetas}
        </Stack>
      </div>
    </>
  );
}

export default HomePage;
