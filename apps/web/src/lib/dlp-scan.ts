/**
 * Google Cloud DLP — AI-powered sensitive data detection.
 * Detects CPFs, phone numbers, emails, addresses, names, etc.
 * using machine learning, not just regex patterns.
 */

export interface DlpFinding {
  tipo: string;
  valor: string; // masked/truncated
  likelihood: string;
  start: number;
  end: number;
}

// Map DLP infoType names to Portuguese labels
const INFO_TYPE_LABELS: Record<string, string> = {
  BRAZIL_CPF_NUMBER: "CPF",
  PERSON_NAME: "Nome Pessoal",
  PHONE_NUMBER: "Telefone",
  EMAIL_ADDRESS: "E-mail",
  STREET_ADDRESS: "Endereço",
  DATE_OF_BIRTH: "Data de Nascimento",
  BRAZIL_CNPJ_NUMBER: "CNPJ",
  CREDIT_CARD_NUMBER: "Cartão de Crédito",
  LOCATION: "Localização",
  GENERIC_ID: "Documento/ID",
};

// InfoTypes to detect (Brazilian-specific + general PII)
const INFO_TYPES = [
  "BRAZIL_CPF_NUMBER",
  "PERSON_NAME",
  "PHONE_NUMBER",
  "EMAIL_ADDRESS",
  "STREET_ADDRESS",
  "DATE_OF_BIRTH",
  "CREDIT_CARD_NUMBER",
  "GENERIC_ID",
];

// InfoTypes to skip (institutional data that should remain visible)
const SKIP_TYPES = new Set(["BRAZIL_CNPJ_NUMBER"]);

export async function dlpScanText(text: string): Promise<DlpFinding[]> {
  try {
    const { DlpServiceClient } = await import("@google-cloud/dlp");
    const dlp = new DlpServiceClient();

    const projectId = process.env.GOOGLE_CLOUD_PROJECT || "dalton-platform";

    const [response] = await dlp.inspectContent({
      parent: `projects/${projectId}/locations/global`,
      inspectConfig: {
        infoTypes: INFO_TYPES.map((name) => ({ name })),
        minLikelihood: "POSSIBLE",
        includeQuote: true,
        limits: {
          maxFindingsPerRequest: 200,
        },
      },
      item: {
        value: text,
      },
    });

    const findings: DlpFinding[] = [];
    const seen = new Set<string>();

    for (const finding of response.result?.findings || []) {
      const infoType = finding.infoType?.name || "UNKNOWN";
      if (SKIP_TYPES.has(infoType)) continue;

      const quote = finding.quote || "";
      const key = `${infoType}:${quote}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const start = Number(finding.location?.byteRange?.start || 0);
      const end = Number(finding.location?.byteRange?.end || 0);

      findings.push({
        tipo: INFO_TYPE_LABELS[infoType] || infoType,
        valor: quote.length > 20 ? quote.slice(0, 20) + "..." : quote,
        likelihood: String(finding.likelihood || "POSSIBLE"),
        start,
        end,
      });
    }

    console.log(`[DLP] Found ${findings.length} sensitive items in ${text.length} chars`);
    return findings;
  } catch (err) {
    console.error("[DLP] Failed:", err instanceof Error ? err.message : err);
    return [];
  }
}
