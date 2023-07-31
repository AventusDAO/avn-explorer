export const put = async <T>(url: string, obj: any): Promise<T> => {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj)
  })
  if (res.status >= 400 && res.status < 600) {
    throw new Error(`PUT /${url} returned ${res.status}. Response: ${await res.text()}`)
  }
  return await res.json()
}

export const get = async <T>(url: string): Promise<T> => {
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  if (res.status >= 400 && res.status < 600) {
    throw new Error(`GET /${url} returned ${res.status}. Response: ${await res.text()}`)
  }
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
  if (res.status >= 400 && res.status < 600) {
    throw new Error(`POST /${url} returned ${res.status}. Response: ${await res.text()}`)
  }
  return await res.json()
}
