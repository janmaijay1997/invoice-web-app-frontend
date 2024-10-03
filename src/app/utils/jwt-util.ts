import { jwtDecode } from "jwt-decode";

export function extractRolesFromToken() {
  const token = localStorage.getItem('token'); // Assuming JWT token is stored in local storage
  if (token) {
     const decodedToken :any = jwtDecode(token);
     return decodedToken.roles ? decodedToken.roles.map((data: any) => data.authority) : [];
  }
}