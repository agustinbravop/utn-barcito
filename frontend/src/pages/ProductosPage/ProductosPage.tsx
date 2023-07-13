import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Box,
  Checkbox,
  FormControl,
  HStack,
  Input,
  FormLabel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import {
  ProductoListProvider,
  useProductoList,
} from "../../hooks/useProductoList";
import { useQuery } from "@tanstack/react-query";
import { getProductos } from "../../utils/api/productos";
import CardProductoList from "../../components/producto/CardProductoList";
import ModalNuevoProducto from "../../components/producto/ModalNuevoProducto";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface FiltroCheckboxProps {
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FiltroCheckbox({ label, name, onChange }: FiltroCheckboxProps) {
  return (
    <Checkbox size="lg" onChange={onChange} value={name} name={name}>
      {label}
    </Checkbox>
  );
}

function FilterableSearchBox() {
  const { setFilterCategs, setFilterStock, setSearch } = useProductoList();
  const [checkedItems, setCheckedItems] = React.useState({
    Galletitas: false,
    Golosinas: false,
    Bebidas: false,
    Comidas: false,
    "Lácteos": false,
  });

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterStock(e.target.checked);
  };

  const handleCategChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const newCheckedItems = {
      ...checkedItems,
      [name]: checked,
    };
    setCheckedItems(newCheckedItems);
    setFilterCategs(
      Object.keys(newCheckedItems).filter(
        (categ) => newCheckedItems[categ as keyof typeof newCheckedItems]
      )
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <Card margin="20px auto 20px auto" maxWidth="1000px">
      <CardHeader padding="10px 0 0 30px">
        <Heading size="md">Filtros</Heading>
      </CardHeader>
      <CardBody width="100%" padding="3">
        <HStack gap="5" justify="space-between" margin="0 15px 0 15px">
          <Box border="lightgrey solid 1px" borderRadius="10" padding="2">
            <Checkbox size="lg" onChange={handleStockChange}>
              Solo con stock
            </Checkbox>
          </Box>
          <FiltroCheckbox
            label="Golosinas"
            name="Golosinas"
            onChange={handleCategChange}
          />
          <FiltroCheckbox
            label="Galletitas"
            name="Galletitas"
            onChange={handleCategChange}
          />
          <FiltroCheckbox
            label="Comidas"
            name="Comidas"
            onChange={handleCategChange}
          />
          <FiltroCheckbox
            label="Bebidas"
            name="Bebidas"
            onChange={handleCategChange}
          />
          <FiltroCheckbox
            label="Lácteos"
            name="Lácteos"
            onChange={handleCategChange}
          />
        </HStack>
        <FormControl
          id="search"
          variant="floating"
          marginLeft="15px"
          marginTop="15px"
          paddingRight="15px"
          onChange={handleSearchChange}
        >
          <Input placeholder="Producto..." name="search" />
          <FormLabel>Buscar producto</FormLabel>
        </FormControl>
      </CardBody>
    </Card>
  );
}

function ProductoList() {
  const { data, isLoading, isError } = useQuery(["productos"], getProductos);
  const { productos, newProductos } = useProductoList();
  const { isAdmin } = useCurrentUser();

  useEffect(() => {
    if (data) {
      newProductos(data);
    }
  }, [data, newProductos]);

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
          No fue posible obtener los productos
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          Ocurrió un error inesperado. Intente de nuevo.
        </AlertDescription>
      </Alert>
    );
  }

  return <CardProductoList productos={productos} puedeEditar={isAdmin} />;
}

export default function ProductosPage() {
  const { isAdmin } = useCurrentUser();
  return (
    <ProductoListProvider>
      {isAdmin && <ModalNuevoProducto />}
      <Heading textAlign="center" fontSize="3rem">
        Productos
      </Heading>

      <FilterableSearchBox />

      <ProductoList />
    </ProductoListProvider>
  );
}
