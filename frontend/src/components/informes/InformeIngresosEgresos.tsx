import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
} from "recharts";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/alert";
import { getIngresosYEgresos } from "../../utils/api/informes";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { Stat, StatLabel, StatNumber, StatHelpText } from "@chakra-ui/stat";
import { HStack } from "@chakra-ui/layout";

interface InformeIngresosEgresosProps {
  desde?: Date;
  hasta?: Date;
}

export default function InformeIngresosEgresos({
  desde,
  hasta,
}: InformeIngresosEgresosProps) {
  const { data, isLoading, isError } = useQuery(
    ["informeIngresos", desde, hasta],
    () => getIngresosYEgresos(desde, hasta)
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

  return (
    <>
      <HStack marginLeft="80px" justify="center">
        <Stat>
          <StatLabel>Margen total</StatLabel>
          <StatNumber>{data.total.margen.toFixed(2)} $</StatNumber>
          <StatHelpText>
            {desde?.toLocaleDateString()} - {hasta?.toLocaleDateString()}
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Ingresos totales</StatLabel>
          <StatNumber>{data.total.ingresos.toFixed(2)} $</StatNumber>
          <StatHelpText>Por ventas realizadas</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Egresos totales</StatLabel>
          <StatNumber>{data.total.egresos.toFixed(2)} $</StatNumber>
          <StatHelpText>Por compras realizadas</StatHelpText>
        </Stat>
      </HStack>

      <ResponsiveContainer height={300}>
        <LineChart
          data={data.fechas}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis type="number" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="ingresos"
            name="Ingresos"
            stroke="green"
          />
          <Line
            type="monotone"
            name="Egresos"
            dataKey="egresos"
            stroke="tomato"
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
