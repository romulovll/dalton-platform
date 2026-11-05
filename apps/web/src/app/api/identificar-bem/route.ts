import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  if (!ANTHROPIC_API_KEY) {
    console.error("[IDENTIFICAR] ANTHROPIC_API_KEY not set");
    return NextResponse.json({ error: "Serviço de IA não configurado" }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get("foto") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Foto é obrigatória" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Apenas imagens são permitidas" }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Imagem deve ter no máximo 10MB" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const mediaType = file.type;

  try {
    console.log(`[IDENTIFICAR] Analyzing image: ${file.name}, ${(file.size / 1024).toFixed(0)}KB, ${mediaType}`);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-5-5",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mediaType, data: base64 },
              },
              {
                type: "text",
                text: `Você é um especialista em controle patrimonial de uma organização sem fins lucrativos no Brasil.

Analise esta foto e responda em JSON com os seguintes campos:

{
  "item": "nome do item identificado",
  "descricao": "descrição detalhada do item (marca, modelo, cor, características visíveis)",
  "deveRegistrar": true/false,
  "motivo": "explicação de por que deve ou não ser registrado como bem patrimonial",
  "categoria": "categoria sugerida (Equipamentos de Informática, Móveis e Utensílios, Equipamentos de Áudio/Vídeo, Material Esportivo, Veículos, Ferramentas, etc.)",
  "vidaUtil": "vida útil estimada em anos",
  "valorEstimado": "faixa de valor estimada em R$",
  "conservacao": "estado de conservação visível (Excelente, Bom, Regular, Ruim, Inservível)"
}

Regras para decidir se deve registrar:
- BEM PERMANENTE (registrar): vida útil > 1 ano, valor significativo (geralmente > R$ 100), usado na atividade da organização
- MATERIAL DE CONSUMO (não registrar): consumido rapidamente, valor baixo individual (garfo, copo, papel, caneta, bola de ping pong)
- Na dúvida, considere: se perder este item, alguém vai sentir falta e precisar comprar outro?

Responda APENAS o JSON, sem texto adicional.`,
              },
            ],
          },
        ],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[IDENTIFICAR] API error:", JSON.stringify(data).slice(0, 300));
      return NextResponse.json({ error: `Erro da IA: ${data.error?.message || res.statusText}` }, { status: 500 });
    }

    // Find text content — collect all text blocks
    const allText = (data.content || [])
      .filter((c: { type: string }) => c.type === "text")
      .map((c: { text: string }) => c.text)
      .join("\n");
    console.log(`[IDENTIFICAR] Response (${allText.length} chars): ${allText.slice(0, 300)}`);

    // Extract JSON — strip markdown code fences, find the JSON object
    const cleaned = allText
      .replace(/```json\n?/gi, "")
      .replace(/```\n?/g, "")
      .trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[IDENTIFICAR] No JSON found in:", cleaned.slice(0, 500));
      return NextResponse.json({ error: "Não foi possível analisar a imagem. Tente com outra foto." }, { status: 500 });
    }

    try {
      const result = JSON.parse(jsonMatch[0]);
      return NextResponse.json(result);
    } catch (parseErr) {
      console.error("[IDENTIFICAR] JSON parse error:", parseErr, "Raw:", jsonMatch[0].slice(0, 200));
      return NextResponse.json({ error: "Erro ao processar resposta da IA. Tente novamente." }, { status: 500 });
    }
  } catch (err) {
    console.error("[IDENTIFICAR] Exception:", err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { error: "Erro ao analisar a imagem. Tente novamente." },
      { status: 500 }
    );
  }
}
