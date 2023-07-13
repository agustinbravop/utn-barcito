import React from "react";
import { Producto } from "../models/types";

interface IProductoListContext {
  productos: Producto[];
  setFilterCategs: (categs: string[]) => void;
  newProductos: (prods: Producto[]) => void;
  setFilterStock: (conStock: boolean) => void;
  setSearch: (search: string) => void;
}

interface ProductoListProviderProps {
  children?: React.ReactNode;
}

const ProductoListContext = React.createContext<IProductoListContext>({
  productos: [],
  newProductos: (_prods) => {},
  setFilterCategs: (_categs) => {},
  setFilterStock: (_conStock) => {},
  setSearch: (_search) => {},
});

export function ProductoListProvider({ children }: ProductoListProviderProps) {
  const [allProds, setAllProds] = React.useState<Producto[]>([]);
  const [filterCategs, setFilterCategs] = React.useState<string[]>([]);
  const [filterStock, setFilterStock] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>("");

  const newProductos = (prods: Producto[]) => {
    setAllProds(prods);
  };

  const productos = allProds
    .filter(
      (p) =>
        filterCategs.length === 0 || filterCategs.includes(p.categoria || "")
    )
    .filter((p) => (filterStock ? p.stock > 0 : true))
    .filter(
      (p) =>
        search === "" || p.nombre.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <ProductoListContext.Provider
      value={{
        productos,
        newProductos,
        setFilterCategs,
        setFilterStock,
        setSearch,
      }}
    >
      {children}
    </ProductoListContext.Provider>
  );
}

export const useProductoList = () => React.useContext(ProductoListContext);
