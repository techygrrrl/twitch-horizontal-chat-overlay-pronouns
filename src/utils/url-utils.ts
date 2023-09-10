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

export function messageVisibilityMilliseconds(): number {
  const defaultMillis = 5000

  const params = new URLSearchParams(location.search);

  const value = params.get("time_ms")

  if (!value) {
    return defaultMillis
  }

  const parsedValue = parseInt(value)
  if (isNaN(parsedValue)) {
    return defaultMillis
  }

  return Math.max(parsedValue, defaultMillis)
}