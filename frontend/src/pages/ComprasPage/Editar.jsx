// import React, { useState } from "react";
// import { useLocation } from "react-router-dom";
// import NavBar from "../../components/NavBar/NavBar";
// import Title from "../../components/Title/Title";
// import { findProductoByID } from "../../data/productos";
// import { Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
// import { getProductos } from "../../utils/api/productos";

// function EditarCompra() {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const id = queryParams.get("id");
//   const nombre_proveedor = queryParams.get("nombre_proveedor");
//   const fecha = queryParams.get("fecha");
//   const lineas = JSON.parse(decodeURIComponent(queryParams.get("lineas")));

//   const [lineasModificadas, setLineasModificadas] = useState(lineas);
//   const [proveedorModificado, setProveedorModificado] =
//     useState(nombre_proveedor);

//   const handleInputChange = (event, index) => {
//     const { name, value } = event.target;
//     setLineasModificadas((prevLineasModificadas) => {
//       const updatedLineas = [...prevLineasModificadas];
//       updatedLineas[index][name] = value;
//       return updatedLineas;
//     });
//   };

//   const handleProveedorChange = (event) => {
//     setProveedorModificado(event.target.value);
//   };

//   const confirmarCambios = () => {
//     console.log(lineasModificadas);
//     console.log(proveedorModificado);
//   };

//   return (
//     <NavBar>
//       <div className="header" style={{ textAlign: "center" }}>
//         <Title styles={{ fontSize: "3rem" }}>Edición de una Compra</Title>
//       </div>
//       <div>
//         <Button colorScheme="teal" variant="outline" onClick={confirmarCambios}>
//           Confirmar Cambios
//         </Button>
//         <p>ID: {id}</p>
//         <p>Proveedor:</p>
//         <Input value={proveedorModificado} onChange={handleProveedorChange} />
//         <p>Fecha: {fecha}</p>
//         <p>Líneas de compra:</p>
//         <ul>
//           {lineasModificadas.map((linea, index) => {
//             const producto = findProductoByID(linea.idProducto);
//             const nombreProducto = producto
//               ? producto.nombre
//               : "Producto no encontrado";

//             return (
//               <li key={linea.linea}>
//                 <p>Linea: {linea.linea}</p>
//                 <p>ID Compra: {linea.idCompra}</p>
//                 <p>Nombre Producto: {nombreProducto}</p>
//                 <Flex>
//                   <FormControl>
//                     <FormLabel htmlFor={`cantidad_${index}`}>
//                       Cantidad:
//                     </FormLabel>
//                     <Input
//                       id={`cantidad_${index}`}
//                       name="cantidad"
//                       value={linea.cantidad}
//                       onChange={(event) => handleInputChange(event, index)}
//                       width="100px"
//                     />
//                   </FormControl>
//                   <FormControl ml={4}>
//                     <FormLabel htmlFor={`precioUnitario_${index}`}>
//                       Precio:
//                     </FormLabel>
//                     <Input
//                       id={`precioUnitario_${index}`}
//                       name="precioUnitario"
//                       value={linea.precioUnitario}
//                       onChange={(event) => handleInputChange(event, index)}
//                       width="100px"
//                     />
//                   </FormControl>
//                 </Flex>
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//     </NavBar>
//   );
// }

// export default EditarCompra;
