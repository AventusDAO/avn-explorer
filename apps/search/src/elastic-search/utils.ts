export const put = async <T>(url: string, obj: any): Promise<T> => {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj)
  })
  return await res.json()
}

export const get = async <T>(url: string): Promise<T> => {
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  return await res.json()
}

export const post = async <T>(
  url: string,
  obj: any,
  contentType = 'application/json'
): Promise<T> => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': contentType },
    // ES bulk does not accept JSON stringified format
    body: contentType === 'application/json' ? JSON.stringify(obj) : obj
  })
  return await res.json()
}
