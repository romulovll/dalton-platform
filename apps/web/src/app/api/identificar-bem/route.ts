import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY não configurada" }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get("foto") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Foto é obrigatória" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Apenas imagens são permitidas" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const mediaType = file.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp";

  try {
    const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

    const response = await client.messages.create({
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
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Não foi possível analisar a imagem" }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[CLAUDE]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Erro ao analisar a imagem. Tente novamente." },
      { status: 500 }
    );
  }
}
