import React from 'react'

export function Loading() {
  return <h3>Loading...</h3>
}

export function Error({ error }: { error: any }) {
  console.log(error.message)
  return <h3 className='text-red-400'>{error.message}</h3>
}

export function NoResults() {
  return <h3>No results!</h3>
}
