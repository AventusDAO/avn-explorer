export interface ProxyCallArgs<A> {
  call: {
    value: A & ProxyCallProof & { __kind: string }
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
