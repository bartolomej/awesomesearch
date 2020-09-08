export async function request (path) {
  const response = await fetch(`${process.env.REACT_APP_API_HOST}${path}`);
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  } else {
    return body;
  }
}
