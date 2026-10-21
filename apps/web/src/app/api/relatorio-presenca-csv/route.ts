import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const presencas = await prisma.presenca.findMany({
    orderBy: [{ data: "desc" }, { atividade: { nome: "asc" } }],
    include: {
      atividade: { select: { nome: true } },
      participante: { select: { nome: true, cpf: true } },
      registradoPor: { select: { nome: true } },
    },
  });

  const header = "Data;Atividade;Participante;CPF;Presente;Observação;Registrado por\n";
  const rows = presencas.map((p) =>
    [
      p.data.toLocaleDateString("pt-BR"),
      `"${p.atividade.nome}"`,
      `"${p.participante.nome}"`,
      p.participante.cpf || "",
      p.presente ? "Sim" : "Não",
      `"${p.observacao || ""}"`,
      p.registradoPor.nome,
    ].join(";")
  );

  const csv = "\uFEFF" + header + rows.join("\n");
  const today = new Date().toISOString().split("T")[0];

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="presenca_${today}.csv"`,
    },
  });
}
