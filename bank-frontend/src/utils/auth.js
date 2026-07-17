export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("customerId");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
}