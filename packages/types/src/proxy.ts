export interface ProxyCallArgs<A> {
  call: {
    __kind: string
    value: A & {
      __kind: string
      proof: ProxyCallProof
      from?: string
      to?: string
      t2TransferToPublicKey?: string
      nodeManagerOwner?: string
      nodeManagerNodeId?: string
    }
  }
  paymentInfo: {
    payer: string
    amount: string
    recipient: string
    signature: {
      value: string
    }
  }
}

export interface ProxyCallProof {
  signer: string
  relayer: string
  signature: {
    value: string
  }
}
