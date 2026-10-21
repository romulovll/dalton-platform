import { getSession } from "@/lib/auth";

// Profile hierarchy (higher = more access)
const PROFILE_LEVEL: Record<string, number> = {
  ADMIN_GERAL: 100,
  ADMIN_UNIDADE: 80,
  GESTOR: 60,
  CONTADOR: 50,
  AUDITOR: 40,
  PROFESSOR: 30,
  RESPONSAVEL_SETOR: 20,
  CONSULTA: 10,
};

type MinProfile = keyof typeof PROFILE_LEVEL;

export async function requireProfile(minProfile: MinProfile) {
  const session = await getSession();
  if (!session) throw new Error("Não autenticado");

  const userLevel = PROFILE_LEVEL[(session.perfil as string) || "CONSULTA"] ?? 0;
  const requiredLevel = PROFILE_LEVEL[minProfile] ?? 0;

  if (userLevel < requiredLevel) {
    throw new Error("Permissão insuficiente para esta ação");
  }

  return session;
}

export async function hasMinProfile(minProfile: MinProfile): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;

  const userLevel = PROFILE_LEVEL[(session.perfil as string) || "CONSULTA"] ?? 0;
  const requiredLevel = PROFILE_LEVEL[minProfile] ?? 0;

  return userLevel >= requiredLevel;
}

export async function getUserPerfil(): Promise<string> {
  const session = await getSession();
  return (session?.perfil as string) || "CONSULTA";
}
