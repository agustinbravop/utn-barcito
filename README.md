# 2023-TPI-GB

Trabajo Práctico integrador - Grupo B

Integrantes:
- Andres, Aldo Omar - aldoandres045@gmail.com
- Bravo Pérez, Agustín Nicolás - anbravoperez@gmail.com
- Brites Agustin Ezequiel - agustinbrites@gmail.com
- Salomon, Hilel Mauricio - hilel.mauricio@gmail.com
- Samuel Octavio Paredes - samuelocta215@gmail.com
- Ramírez, Eduardo Manuel - edu.ramirez645@gmail.com

## Levantar el proyecto

Guía rápida para desplegar la aplicación en un entorno local de desarrollo.
Se requiere tener una base de datos MySQL.

1. Clonar el repositorio:

```
git clone https://github.com/FRRe-DS/2023-TPI-GB
```

2. Levantar el servidor de la API REST:

```
cd backend
echo "DATABASE_URL="mysql://{user}:{password}@localhost:3306/{nombredb}"" > .env
npm install
npx prisma migrate dev
npm run dev
```

Nótese la variable de entorno con los datos {user}, {password} y {nombredb}, de la base de datos MySQL.
Por defecto se levanta en el puerto 3001. Se puede modificar agregando otra variable de entorno `PORT`.

3. Levantar el servidor frontend:

```
cd ../frontend
echo "REACT_APP_API_BASE_URL="http://localhost:3001"" > .env
npm install
npm run start
```

Por defecto se levanta en el puerto 3000. La app se puede visitar en http://localhost:3000.

## Escenario planteado

El bar de Pedro quiere automatizar las compras que los clientes realizan en las instalaciones de la FRRe. Para esto se necesita mantener una lista de productos, los precios asociados a cada producto, las compras realizadas y las ventas realizadas.

El sistema debe realizar al fin del día un reporte de las ventas realizadas, indicando el margen de ganancias. Estos reportes deben ser también semanales, mensuales y anuales.

## Alcance

El sistema contempla la creación y modificación de productos, que se asocian a ventas y compras. La creación de estas compras (a proveedores) y ventas (a clientes) aumentan o reducen el stock del producto, y el sistema valida que la venta a crear sea posible en base al stock actual. También se contempla la generación de informes de ventas en un rango de tiempo (*desde* una fecha *hasta* otra fecha), para facilitar la toma de decisiones de la organización.

Además, se agregan 2 roles de usuarios, **empleado** y **administrador**. Mientras que el administrador tiene acceso a todas las funcionalidades, el empleado solo puede consultar datos o crear ventas, ideal para un vendedor que solamente atiende a estudiantes, y no se encarga de comprarle productos a proveedores. También se hizo énfasis en la usabilidad y sencillez de la aplicación, creando una interfaz de usuario amigable para que cualquier persona pueda utilizarla.

Diagrama de casos de uso:

![Casos de uso del empleado y del administrador](/docs/casos_de_uso.png?raw=true "Diagrama de casos de uso")

## Modelo de datos

El modelo de datos del escenario contiene las entidades `productos`, `compras`, `linea_compras`, `venta` y `linea_ventas`. Si bien el proyecto genera el esquema de la base de datos automáticamente gracias a Prisma ORM, se adjunta el esquema propuesto por la cátedra.

<details>
  <summary>SQL para la creación de tablas</summary>
  
  ```sql
CREATE TABLE productos (
 id     integer   not null,
 nombre    varchar(20)  not null,
 stock    integer   not null,
 precio    decimal(12,2) not null,
 categoria   varchar(20)  null,
 fecha_actualizacion timestamp   null
);

ALTER TABLE productos
ADD CONSTRAINT pk_productos
PRIMARY KEY (id);

CREATE TABLE compras (
id integer not null,
fecha timestamp not null,
proveedor varchar(50) null
);

ALTER TABLE compras
ADD CONSTRAINT pk_compras
PRIMARY KEY (id);

CREATE TABLE linea_compras (
id_compra integer not null,
linea integer not null,
id_producto integer not null,
cantidad integer not null,
precio_unitario decimal(12,2) not null
);

ALTER TABLE linea_compras
ADD CONSTRAINT pk_linea_compras
PRIMARY KEY (id_compra, linea);

ALTER TABLE linea_compras
ADD CONSTRAINT fk_linea_compras_ref_producto
FOREIGN KEY (id_producto)
REFERENCES productos (id);

ALTER TABLE linea_compras
ADD CONSTRAINT fk_linea_compras_ref_compras
FOREIGN KEY (id_compra)
REFERENCES compras (id);

CREATE TABLE ventas (
id integer not null,
fecha timestamp not null,
cliente varchar(50) null
);

ALTER TABLE ventas
ADD CONSTRAINT pk_ventas
PRIMARY KEY (id);

CREATE TABLE linea_ventas (
id_venta integer not null,
linea integer not null,
id_producto integer not null,
cantidad integer not null,
precio_unitario decimal(12,2) not null
);

ALTER TABLE linea_ventas
ADD CONSTRAINT pk_linea_ventas
PRIMARY KEY (id_venta, linea);

ALTER TABLE linea_ventas
ADD CONSTRAINT fk_linea_ventas_ref_productos
FOREIGN KEY (id_producto)
REFERENCES productos (id);

ALTER TABLE linea_ventas
ADD CONSTRAINT fk_linea_ventas_ref_ventas
FOREIGN KEY (id_venta)
REFERENCES ventas (id);

```

</details>

Modelo de datos:

![Modelo de datos relacional](/docs/modelo_de_datos.png?raw=true "Modelo de datos en MySQL")


## Arquitectura

Se dividió la aplicación en tres partes:
1. Una SPA como **front end**. Escrito en TypeScript con React como framework.
2. Una API REST como **back end**. Escrito en TypeScript y ejecutado con NodeJS como runtime.
3. Una **base de datos** MySQL.

Esquema de la arquitectura de la aplicación:

![Arquitectura y tecnologías usadas](/docs/arquitectura.png?raw=true "Arquitectura y tecnologías")


### Tecnologías
- **Typescript:** usado para agregarle un control de tipos a JavaScript, facilitando el desarrollo en equipo, principalmente gracias al autocompletado del IDE que los tipos de datos posibilitan.

- **React:** librería de componentes utilizada para desarrollar la UI del frontend.

- **Prisma ORM:** Object Relational Mapper que se compila a partir de un archivo `schema.prisma`. Se utilizó para comunicarse con la base de datos.

### Librerías
- **Chakra UI:** librería de componentes de React que facilita crear interfaces dinámicas y accesibles. Se aprovechó para evitar construir todos los componentes desde cero.

- **React Query:** libería de React que nos ofrece un hook `useQuery` para consultar datos del back end usando un verbo GET, y un hook `useMutation` para un POST/PUT/DELETE. Hace reintentos y cachés por defecto. 

- **Express.js:** framework HTTP para la creación de un servidor, en nuestro caso una API REST. Nos facilita definir  un handler para cada ruta de nuestra aplicación. 

- **Recharts:** librería de componentes de React que nos facilita crear gráficos de todo tipo. Fue usada para desarrollar los informes que la aplicación muestra.
