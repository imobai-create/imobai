
export type EscrowProvider = "MOCK";

export type EscrowStatus =
  | "DRAFT"            // criado, mas sem cobrança
  | "AWAITING_PAYMENT" // aguardando comprador pagar
  | "PAID"             // dinheiro entrou (ou confirmado)
  | "RELEASED"         // liberado ao vendedor (taxa deduzida)
  | "CANCELED";

export type EscrowIntent = {
  provider: EscrowProvider;
  providerReference: string; // id externo (no mock, um uuid)
  status: EscrowStatus;
  amountCents: number;
  currency: "BRL";
};

// Para não travar seu MVP: a integração real fica encapsulada aqui.
export function createEscrowIntent(params: { amountCents: number }): EscrowIntent {
  // providerReference pode ser substituído por ID do PSP depois
  const providerReference = `mock_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  return {
    provider: "MOCK",
    providerReference,
    status: "DRAFT",
    amountCents: params.amountCents,
    currency: "BRL",
  };
}

// Regras de taxa (1% no fechamento)
export function calcPlatformFeeCents(totalAmountCents: number): number {
  // 1% => 0.01
  return Math.round(totalAmountCents * 0.01);
}