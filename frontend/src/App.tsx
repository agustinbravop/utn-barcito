import { useEffect } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import HomePage from "./pages/HomePage/HomePage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import ProductosPage from "./pages/ProductosPage/ProductosPage";
import VentasPage from "./pages/VentasPage/VentasPage";
import ComprasPage from "./pages/ComprasPage/ComprasPage";
import NuevaCompraPage from "./pages/NuevaCompraPage/NuevaCompraPage";
// import Editar from "./pages/ComprasPage/Editar"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NuevaVentaPage from "./pages/NuevaVentaPage/NuevaVentaPage";
import NavBar from "./components/NavBar/NavBar";
import LoginPage from "./pages/LoginPage.tsx/LoginPage";
import { CurrentUserProvider } from "./hooks/useCurrentUser";
import InformesPage from "./pages/InformesPage/InformesPage";

const routes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/*",
    element: <NavBar />,
    children: [
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "productos",
        element: <ProductosPage />,
      },
      {
        path: "ventas",
        element: <VentasPage />,
      },
      {
        path: "ventas/nueva",
        element: <NuevaVentaPage />,
      },
      {
        path: "compras",
        element: <ComprasPage />,
      },
      {
        path: "compras/nueva",
        element: <NuevaCompraPage />,
      },
      {
        path: "informes",
        element: <InformesPage />,
      },
      // {
      //   path: "/EditarCompra",
      //   element: <Editar />,
      // },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
];

const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)",
};

export const theme = extendTheme({
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
              {
                ...activeLabelStyles,
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "white",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: "left top",
            },
          },
        },
      },
    },
  },
});

const router = createBrowserRouter(routes);
const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    document.title = "El Barcito"; // Cambia el título del head
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <CurrentUserProvider>
          <RouterProvider router={router} />
        </CurrentUserProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
