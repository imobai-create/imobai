
export function generateIndicacaoContract({
  propertyTitle,
  propertyId,
  sellerName,
  buyerName,
  price
}: {
  propertyTitle: string
  propertyId: number
  sellerName: string
  buyerName: string
  price: number
}) {

return `
CONTRATO DE INDICAÇÃO DE NEGÓCIO IMOBILIÁRIO

Plataforma: IMOB AI

Imóvel:
${propertyTitle}
ID: ${propertyId}

Vendedor: ${sellerName}
Comprador: ${buyerName}

CLÁUSULA 1 – OBJETO

A plataforma realizou a aproximação entre comprador e vendedor para negociação do imóvel acima identificado.

CLÁUSULA 2 – TAXA DE INDICAÇÃO

O vendedor pagará à plataforma taxa de 1% sobre o valor total da transação.

Valor estimado do negócio:
R$ ${price}

CLÁUSULA 3 – MOMENTO DE PAGAMENTO

A taxa será devida no primeiro dos eventos abaixo:

1 assinatura de promessa de compra e venda
2 pagamento de sinal
3 assinatura de escritura

CLÁUSULA 4 – NÃO CIRCUNVENÇÃO

As partes concordam em não contornar a plataforma.

CLÁUSULA 5 – PROVA DIGITAL

O presente contrato poderá ser registrado digitalmente por meio de hash criptográfico e blockchain.

Data: ${new Date().toISOString()}

`
}


