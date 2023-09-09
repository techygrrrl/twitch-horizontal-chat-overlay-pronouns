export function tokenFromURL() {
  const params = new URLSearchParams(location.search);
  return params.get("token");
}

export function portFromURL() {
  const params = new URLSearchParams(location.search);
  return params.get("port") || "9999";
}

export function debugModeFromURL(): boolean {
  const params = new URLSearchParams(location.search);

  const value = (params.get("debug") || "").toLowerCase()

  return value === "true" || value === "1" || value === "yes";
}