export const API_URL = process.env.REACT_APP_API_BASE_URL;

export class ApiError extends Error {
  status: number;
  message: string;

  constructor(status: number, msg: string) {
    super(msg);
    this.message = msg;
    this.status = status;
  }
}

/**
 * Una petición al backend fallida devuelve un `ApiError`.
 * Esta función ayuda a tirar un error con la información del ApiError.
 * @param res la respuesta con status indeseado.
 * @returns una promesa con el `ApiError` parseado.
 */
async function reject(res: Response): Promise<ApiError> {
  const body = await res.json();
  return Promise.reject(
    new ApiError(
      (body && body.status) || 0,
      (body && body.message) || "Ocurrió un error inesperado"
    )
  );
}

/**
 * Ayuda a construir las solicitudes.
 * @param method el verbo HTTP de la petición
 * @param endpoint el endpoint de la API
 * @returns el objeto Request que consume `fetch`, al hacer `fetch(request(...))`
 */
function request(method: string, endpoint: string): Request {
  return new Request(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors" as RequestMode,
    cache: "default" as RequestCache,
  });
}

export async function get<T>(endpoint: string): Promise<T> {
  return fetch(request("GET", endpoint))
    .then((res) => (res.ok ? res.json() : reject(res)))
    .then((data) => data as T);
}

export async function post<T>(
  endpoint: string,
  body: object,
  expectedStatus: number
): Promise<T> {
  return fetch(request("POST", endpoint), {
    body: JSON.stringify(body),
  })
    .then((res) => (res.status === expectedStatus ? res.json() : reject(res)))
    .then((data) => data as T);
}

export async function put<T>(
  endpoint: string,
  body: object,
  expectedStatus: number
): Promise<T> {
  return fetch(request("PUT", endpoint), {
    body: JSON.stringify(body),
  })
    .then((res) => (res.status === expectedStatus ? res.json() : reject(res)))
    .then((data) => data as T);
}
