export type DiligenciaRow = {
  id?: number;
  tipo?: string | null;
  status?: string | null;
  detalhes?: string | null;
  created_at?: string | null;
};

export type RiskScoreResult = {
  score: number;
  label: string;
  tone: "green" | "yellow" | "red";
  resumo: string;
  fatoresPositivos: string[];
  fatoresRisco: string[];
};

function normalize(text: string | null | undefined) {
  return String(text ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

export function calculatePropertyRiskScore(args: {
  statusDiligencia?: string | null;
  diligencias: DiligenciaRow[];
}): RiskScoreResult {
  const statusDiligencia = normalize(args.statusDiligencia);
  const diligencias = args.diligencias ?? [];

  let score = 70;

  const fatoresPositivos: string[] = [];
  const fatoresRisco: string[] = [];

  if (statusDiligencia.includes("aprov")) {
    score += 18;
    fatoresPositivos.push("Diligência principal aprovada.");
  } else if (statusDiligencia.includes("pendente")) {
    score -= 8;
    fatoresRisco.push("Diligência ainda pendente.");
  } else if (
    statusDiligencia.includes("risco") ||
    statusDiligencia.includes("reprov") ||
    statusDiligencia.includes("bloque")
  ) {
    score -= 30;
    fatoresRisco.push("Status principal da diligência indica risco.");
  } else if (statusDiligencia.includes("analise")) {
    score -= 5;
    fatoresRisco.push("Diligência ainda em análise.");
  }

  for (const item of diligencias) {
    const tipo = normalize(item.tipo);
    const status = normalize(item.status);
    const detalhes = normalize(item.detalhes);
    const texto = `${tipo} ${status} ${detalhes}`;

    const statusOk =
      hasAny(status, ["ok", "aprovado", "regular", "verificado", "sem restricao", "sem restricoes"]) ||
      hasAny(detalhes, ["sem restricao", "sem restricoes", "regular", "nada consta", "negativa"]);

    const statusPendente =
      hasAny(status, ["pendente", "analise", "em analise"]) ||
      hasAny(detalhes, ["pendente", "analise", "em analise"]);

    const statusRisco =
      hasAny(texto, [
        "processo",
        "execucao",
        "falencia",
        "trabalhista",
        "criminal",
        "penhora",
        "onus",
        "indisponibilidade",
        "restricao",
        "irregular",
        "protesto",
        "debito",
        "bloqueio",
        "fraude",
      ]) &&
      !hasAny(texto, ["sem processo", "sem onus", "sem restricao", "sem restricoes", "sem debito", "nada consta"]);

    if (statusOk) {
      score += 6;

      if (tipo.includes("matricula")) {
        fatoresPositivos.push("Matrícula com retorno positivo.");
      } else if (tipo.includes("fiscal")) {
        fatoresPositivos.push("Situação fiscal sem alerta relevante.");
      } else if (tipo.includes("judicial") || tipo.includes("processo")) {
        fatoresPositivos.push("Consulta judicial sem alerta relevante.");
      } else {
        fatoresPositivos.push(`Verificação positiva: ${item.tipo ?? "registro"}.`);
      }
    }

    if (statusPendente) {
      score -= 4;
      fatoresRisco.push(`Verificação ainda pendente: ${item.tipo ?? "registro"}.`);
    }

    if (statusRisco) {
      if (tipo.includes("criminal")) {
        score -= 22;
        fatoresRisco.push("Alerta sensível em verificação criminal.");
      } else if (tipo.includes("trabalh")) {
        score -= 14;
        fatoresRisco.push("Há alerta em verificação trabalhista.");
      } else if (tipo.includes("fiscal")) {
        score -= 12;
        fatoresRisco.push("Há alerta em verificação fiscal.");
      } else if (tipo.includes("matricula") || tipo.includes("onus")) {
        score -= 18;
        fatoresRisco.push("Há alerta registral / ônus do imóvel.");
      } else if (tipo.includes("judicial") || tipo.includes("processo") || tipo.includes("execucao")) {
        score -= 16;
        fatoresRisco.push("Há alerta judicial relevante.");
      } else {
        score -= 10;
        fatoresRisco.push(`Alerta identificado em ${item.tipo ?? "verificação"}.`);
      }
    }
  }

  if (diligencias.length === 0) {
    score -= 12;
    fatoresRisco.push("Ainda não há diligências registradas no imóvel.");
  } else if (diligencias.length >= 3) {
    score += 4;
    fatoresPositivos.push("Há múltiplas verificações registradas.");
  }

  if (score > 100) score = 100;
  if (score < 0) score = 0;

  let label = "Atenção";
  let tone: "green" | "yellow" | "red" = "yellow";
  let resumo = "Há base documental inicial, mas ainda existem pontos que pedem atenção.";

  if (score >= 85) {
    label = "Baixo risco";
    tone = "green";
    resumo = "Imóvel com boa leitura documental e jurídica dentro do que foi registrado na plataforma.";
  } else if (score >= 60) {
    label = "Atenção";
    tone = "yellow";
    resumo = "Imóvel negociável, mas o comprador deve revisar os pontos pendentes antes de avançar.";
  } else {
    label = "Alto risco";
    tone = "red";
    resumo = "Há alertas relevantes. O ideal é não avançar sem revisão jurídica aprofundada.";
  }

  return {
    score,
    label,
    tone,
    resumo,
    fatoresPositivos: Array.from(new Set(fatoresPositivos)).slice(0, 5),
    fatoresRisco: Array.from(new Set(fatoresRisco)).slice(0, 5),
  };
}




