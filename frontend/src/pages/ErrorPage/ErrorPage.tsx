import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const url = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (url.pathname === "/") {
      navigate("/home");
    }
  }, [navigate, url.pathname]);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1 style={{ fontSize: "3rem" }}>
        <p>404</p>
      </h1>
      <Link to="/home">
        <Button colorScheme="blue" variant="solid" size="md">
          Ir al Inicio
        </Button>
      </Link>
    </div>
  );
}
