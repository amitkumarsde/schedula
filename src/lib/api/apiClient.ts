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

// Reads data from our API.
export async function apiGet(path: string) {
  return request(path);
}

// Sends data to our API.
export async function apiPost(path: string, body: unknown) {
  return request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
