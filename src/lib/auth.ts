export function isAuthenticated(): boolean {
  try {
    const token = localStorage.getItem("authToken");
    return Boolean(token);
  } catch {
    return false;
  }
}

export function requireAuth(): boolean {
  return isAuthenticated();
}

export function logout(): void {
  try {
    localStorage.removeItem("authToken");
    localStorage.removeItem("auth:role");
  } catch {
    // ignore
  }
}
