export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getUsuario } from "@/lib/actions/users";
import { getUnidades } from "@/lib/actions/units";
import { EditUserForm } from "./edit-user-form";

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [usuario, unidades] = await Promise.all([
    getUsuario(id),
    getUnidades(),
  ]);

  if (!usuario) notFound();

  const currentPerfil = usuario.unidades[0]?.perfil || "CONSULTA";
  const currentUnidadeIds = usuario.unidades.map((u) => u.unidade.id);

  return (
    <EditUserForm
      usuario={{
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cpf: usuario.cpf ?? "",
        telefone: usuario.telefone ?? "",
        situacao: usuario.situacao,
        perfil: currentPerfil,
        unidadeIds: currentUnidadeIds,
      }}
      unidades={unidades.map((u) => ({
        id: u.id,
        nome: u.nome,
        codigo: u.codigo,
      }))}
    />
  );
}
