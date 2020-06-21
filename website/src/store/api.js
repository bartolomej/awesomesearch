async function request (path) {
  const response = await fetch(`${process.env.GATSBY_API_HOST}${path}`);
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  } else {
    return body;
  }
}

export function search (query, page = 0, limit = 20) {
  return request(`/search?q=${query}&page=${page}&limit=${limit}`)
}

export function suggest (query, page = 0) {
  return request(`/suggest?q=${query}&page=${page}`)
}

export function getStats () {
  return request(`/stats`)
}

export function getAllLists (page = 0, limit = 20) {
  return request(`/list?page=${page}&limit=${limit}`);
}

export function getList (uid) {
  return request(`/list/${uid}`);
}

export function getLinks (listUid, page = 0, limit = 20) {
  return request(`/list/${listUid}/link?page=${page}&limit=${limit}`);
}
