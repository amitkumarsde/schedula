// Talks to our API and checks the reply, so no component has to repeat this.
async function request(path: string, options?: RequestInit) {
  let response: Response;

  try {
    response = await fetch(`/api${path}`, options);
  } catch {
    throw new Error("Could not reach the server, please check your internet");
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("The server sent an unexpected reply");
  }

  if (!data.success) throw new Error(data.message || "Something went wrong");

  return data;
}

export async function apiGet(path: string) {
  return request(path);
}

// Sends a JSON body to our API. POST and PUT only differ by the method name.
function sendJson(path: string, method: string, body: unknown) {
  return request(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function apiPost(path: string, body: unknown) {
  return sendJson(path, "POST", body);
}

export async function apiPut(path: string, body: unknown) {
  return sendJson(path, "PUT", body);
}

export async function apiPatch(path: string, body: unknown) {
  return sendJson(path, "PATCH", body);
}
