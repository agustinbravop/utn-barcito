import {
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import InformeProductosVendidos from "../../components/informes/InformeProductosVendidos";
import InformeIngresosEgresos from "../../components/informes/InformeIngresosEgresos";
import { useState } from "react";

interface FiltrosState {
  desde: string;
  hasta: string;
}

function InformesPage() {
  const [filtros, setFiltros] = useState<FiltrosState>({
    desde: "",
    hasta: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  // Transforma de un string a un Date, inclusiva del día (no tiene en cuenta el horario, solo el día).
  const desde = filtros.desde ? new Date(filtros.desde) : undefined;
  const hasta = filtros.hasta ? new Date(filtros.hasta) : undefined;
  desde?.setHours(0, 0, 0, 0);
  hasta?.setHours(23, 59, 59, 999);

  return (
    <VStack gap="20px" style={{ margin: "10px" }}>
      <Heading size="xl" textAlign="center">
        Informes
      </Heading>

      <Card width="90%">
        <CardBody>
          <HStack spacing="4" justifyContent="flex-start" margin="auto">
            <Heading size="md">Filtros</Heading>

            <FormControl
              id="desde"
              variant="floating"
              onChange={handleChange}
              maxWidth="200px"
            >
              <Input placeholder="Desde" name="desde" type="date" />
              <FormLabel>Desde</FormLabel>
            </FormControl>
            <FormControl
              id="hasta"
              variant="floating"
              onChange={handleChange}
              maxWidth="200px"
            >
              <Input placeholder="Hasta" name="hasta" type="date" />
              <FormLabel>Hasta</FormLabel>
            </FormControl>
          </HStack>
        </CardBody>
      </Card>

      <Card width="90%">
        <CardHeader>
          <Heading size="md" margin="20px 0 20px 0">
            Total vendido por categoría
          </Heading>
        </CardHeader>
        <CardBody>
          <InformeProductosVendidos desde={desde} hasta={hasta} />
        </CardBody>
      </Card>

      <Card width="90%">
        <CardHeader>
          <Heading size="md" margin="20px 0 20px 0">
            Ingresos y egresos
          </Heading>
        </CardHeader>
        <CardBody>
          <InformeIngresosEgresos desde={desde} hasta={hasta} />
        </CardBody>
      </Card>
    </VStack>
  );
}

export default InformesPage;
