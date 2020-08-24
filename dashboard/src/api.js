async function request (path, method = 'GET') {
  const response = await fetch(`${process.env.REACT_APP_API_HOST}${path}`, { method });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  } else {
    return body;
  }
}

export function getLists (page = 0, limit = 20) {
  return request(`/list?p=${page}&limit=${limit}`)
}

export function postJob (url) {
  return request(`/admin/list?url=${url}`, 'POST');
}

export function getStats () {
  return request(`/stats`);
}

export function getSearchStats (groupBy = 'date') {
  return request(`/admin/search/stats?group=${groupBy}`);
}
