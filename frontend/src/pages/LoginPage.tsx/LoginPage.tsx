import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Image,
  Input,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { ApiError } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface LoginState {
  username: string;
  clave: string;
}

function LoginPage() {
  const [state, setState] = useState<LoginState>({
    username: "",
    clave: "",
  });
  const navigate = useNavigate();
  const { currentUser, login } = useCurrentUser();

  // Si ya está logueado, se lo redirecciona al home.
  useEffect(() => {
    if (currentUser) {
      navigate("/home");
    }
  }, [navigate, currentUser]);

  const toast = useToast();
  const { mutate, isLoading } = useMutation<void, ApiError, LoginState>({
    mutationFn: () => Promise.resolve(),
    onSuccess: () => {
      toast({
        title: "Sesión iniciada correctamente.",
        description: `Bienvenido de nuevo.`,
        status: "success",
        duration: 6000,
        isClosable: true,
      });
      login(state.username);
      navigate("/home");
    },
    onError: () => {
      toast({
        title: "Error al iniciar sesión.",
        description: `Intente de nuevo.`,
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(state);
  };

  return (
    <Stack
      margin="100px auto"
      justify="center"
      align="center"
      gap="100px"
      direction={{ base: "column", sm: "row" }}
    >
      <div>
        <Text textAlign="center" marginBottom="10px" fontSize="36px">
          El Barcito
        </Text>
        <Image width="200px" height="200px" src="/images/favicon.jpg" />
      </div>
      <Card width="450px">
        <CardHeader>
          <Heading size="lg" fontSize="3rem" textAlign="center">
            Iniciar Sesión
          </Heading>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <VStack
              spacing="4"
              width="70%"
              justifyContent="center"
              margin="auto"
            >
              <FormControl
                id="username"
                variant="floating"
                onChange={handleChange}
                maxWidth="300px"
              >
                <Input placeholder="usuario" name="username" />
                <FormLabel>Nombre de usuario</FormLabel>
                <FormHelperText>Ingresar 'admin' o 'vendedor'.</FormHelperText>
              </FormControl>
              <FormControl
                id="clave"
                variant="floating"
                onChange={handleChange}
                maxWidth="300px"
              >
                <Input placeholder="Contraseña" name="clave" type="password" />
                <FormLabel>Contraseña</FormLabel>
                <FormHelperText>Cualquier contraseña es válida.</FormHelperText>
              </FormControl>
              <HStack>
                <Button type="submit" colorScheme="green" isLoading={isLoading}>
                  Iniciar Sesión
                </Button>
              </HStack>
            </VStack>
          </form>
        </CardBody>
      </Card>
    </Stack>
  );
}

export default LoginPage;
