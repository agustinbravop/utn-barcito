import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getProductosVendidosPorCategoria } from "../../utils/api/informes";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/alert";
import { HStack } from "@chakra-ui/layout";
import { Stat, StatHelpText, StatLabel, StatNumber } from "@chakra-ui/stat";

interface InformeProductosVendidosProps {
  desde?: Date;
  hasta?: Date;
}

export default function InformeProductosVendidos({
  desde,
  hasta,
}: InformeProductosVendidosProps) {
  const {
    data: informe,
    isLoading,
    isError,
  } = useQuery(["informeProductos", desde, hasta], () =>
    getProductosVendidosPorCategoria(desde, hasta)
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          No fue posible obtener el reporte
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          Ocurrió un error inesperado. Intente de nuevo.
        </AlertDescription>
      </Alert>
    );
  }

  let total = 0;
  let minCategoria = { nombre: "", cantidad: Number.MAX_SAFE_INTEGER };
  let maxCategoria = { nombre: "", cantidad: 0 };
  const data = informe?.categorias.map(({ nombre, cantidad }) => {
    total += cantidad;
    if (cantidad < minCategoria.cantidad) {
      minCategoria = { nombre, cantidad };
    }
    if (cantidad > maxCategoria.cantidad) {
      maxCategoria = { nombre, cantidad };
    }
    return { name: nombre, cant: cantidad };
  });

  return (
    <>
      <HStack marginLeft="80px" justify="center">
        <Stat>
          <StatLabel>Total</StatLabel>
          <StatNumber>{total}</StatNumber>
          <StatHelpText>Unidades vendidas</StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Mayor categoría</StatLabel>
          <StatNumber>{maxCategoria.nombre}</StatNumber>
          <StatHelpText>{maxCategoria.cantidad} unidades</StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Menor categoría</StatLabel>
          <StatNumber>{minCategoria.nombre}</StatNumber>
          <StatHelpText>{minCategoria.cantidad} unidades</StatHelpText>
        </Stat>
      </HStack>

      <ResponsiveContainer height={300}>
        <BarChart width={730} height={250} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis type="number" />
          <Tooltip />
          <Legend></Legend>
          <Bar dataKey="cant" name="Unidades" label="Unidades" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
