import { createHash } from 'crypto'

export function generateContractHash(contract: string) {
  return createHash('sha256').update(contract).digest('hex')
}