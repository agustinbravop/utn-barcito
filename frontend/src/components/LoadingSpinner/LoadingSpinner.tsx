import { Container, Spinner } from "@chakra-ui/react";

export default function LoadingSpinner() {
  return (
    <Container centerContent>
      <Spinner size="lg" label="Cargando..." speed="0.6s" />
    </Container>
  );
}
