async function request (path) {
  const response = await fetch(`${process.env.REACT_APP_API_HOST}${path}`);
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  } else {
    return body;
  }
}

export function search (query, page = 0) {
  return request(`/search?q=${query}&p=${page}`)
}

export function getRandomObjects (n = 10) {
  return request(`/random?n=${n}`)
}

export function getStats () {
  return request(`/stats`)
}

export function getList (uid) {
  return request(`/list/${uid}`);
}

export function getLinks (listUid, page = 0) {
  return request(`/list/${listUid}/link?page=${page}`);
}
