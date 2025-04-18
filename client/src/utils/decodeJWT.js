import { jwtDecode } from "jwt-decode";

export const decodeJWT = (token) => jwtDecode(token);