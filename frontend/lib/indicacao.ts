type DealData = {
  dealId: number;
  propertyId: number;
  propertyTitle: string;
  priceBRL: string;
};

export function renderContratoIndicacao(d: DealData) {
  return [
    "CONTRATO DE INDICAÇÃO DE NEGÓCIO IMOBILIÁRIO",
    "",
    `Plataforma: IMOBAI — você no comando`,
    `Imóvel: ${d.propertyTitle}`,
    `ID do imóvel: ${d.propertyId}`,
    `ID da negociação (deal): ${d.dealId}`,
    "",
    "CLÁUSULA 1 — OBJETO",
    "A plataforma realizou a aproximação entre comprador e vendedor para negociação do imóvel acima identificado.",
    "",
    "CLÁUSULA 2 — TAXA DE INDICAÇÃO (1%)",
    `No fechamento do negócio, o VENDEDOR pagará à plataforma a taxa de 1% sobre o valor total da transação.`,
    `Referência de preço: ${d.priceBRL}.`,
    "",
    "CLÁUSULA 3 — MOMENTO DO PAGAMENTO",
    "A taxa é devida no fechamento (assinatura do instrumento definitivo e/ou conclusão financeira do negócio).",
    "",
    "CLÁUSULA 4 — NÃO CIRCUNVENÇÃO",
    "As partes concordam em não contornar a plataforma para evitar a taxa devida.",
    "",
    "CLÁUSULA 5 — PROVA DIGITAL (HASH)",
    "Este contrato pode ser registrado digitalmente por meio de hash criptográfico e blockchain como camada adicional de prova.",
    "",
    `Data: ${new Date().toISOString()}`,
  ].join("\n");
}

