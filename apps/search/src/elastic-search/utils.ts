export const put = async (url: string, obj: any): Promise<any> => {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj)
  })
  return await res.json()
}

export const get = async (url: string): Promise<any> => {
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  return await res.json()
}
