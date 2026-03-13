export type Diligencia = {
  tipo: string
  status: string
  impacto_score: number
}

export function calcularScore(diligencias: Diligencia[]) {

  let base = 100

  for (const d of diligencias) {
    base += d.impacto_score
  }

  if (base > 100) base = 100
  if (base < 0) base = 0

  let risco = "baixo"

  if (base < 70) risco = "medio"
  if (base < 50) risco = "alto"

  return {
    score: base,
    risco
  }
}