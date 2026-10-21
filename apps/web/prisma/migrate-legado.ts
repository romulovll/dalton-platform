/**
 * Migration script: Legacy system → Presença module
 * Reads from dalton_legado (localhost:5432), writes to Cloud SQL (via proxy :5433)
 * Masks personal data (names, CPFs, phones, addresses) for LGPD compliance
 */

import { PrismaClient } from "@prisma/client";
import pg from "pg";

const SOURCE_URL = "postgresql://dalton:dalton_inv_2026@localhost:5432/dalton_legado";
const TARGET_URL = process.env.DATABASE_URL || "postgresql://dalton:dalton_inv_2026@127.0.0.1:5433/dalton_inventario";

const prisma = new PrismaClient({ datasources: { db: { url: TARGET_URL } } });
const source = new pg.Pool({ connectionString: SOURCE_URL });

// Masking functions
function maskName(name: string): string {
  if (!name) return name;
  const parts = name.split(" ");
  return parts.map((p, i) => {
    if (i === 0) return p; // keep first name
    if (["de", "da", "do", "dos", "das", "e"].includes(p.toLowerCase())) return p;
    return p[0] + "."; // abbreviate
  }).join(" ");
}

function maskCpf(cpf: string | null): string | null {
  if (!cpf) return null;
  // Replace middle digits: 123.456.789-01 → 123.***.***-01
  return cpf.replace(/^(\d{3})\.\d{3}\.\d{3}(-\d{2})$/, "$1.***.***$2")
    .replace(/^(\d{3})\d{6}(\d{2})$/, "$1******$2");
}

function maskPhone(phone: string | null): string | null {
  if (!phone) return null;
  return phone.replace(/\d(?=\d{4})/g, "*");
}

function maskAddress(addr: string | null): string | null {
  if (!addr) return null;
  // Keep only the street name, mask the number
  return addr.replace(/\d+/g, "***");
}

// Map legacy unit strings to existing Unidade IDs
async function getUnitMapping(): Promise<Map<string, string>> {
  const unidades = await prisma.unidade.findMany({ select: { id: true, nome: true } });
  const map = new Map<string, string>();

  // Map legacy unit names to existing units
  for (const u of unidades) {
    map.set(u.nome.toLowerCase(), u.id);
  }

  // Create units if they don't exist
  const legacyUnits = await source.query("SELECT DISTINCT unit FROM participants WHERE unit IS NOT NULL UNION SELECT DISTINCT unit FROM activities WHERE unit IS NOT NULL");

  for (const row of legacyUnits.rows) {
    const name = row.unit;
    if (!name) continue;
    const key = name.toLowerCase();
    if (!map.has(key)) {
      // Find by partial match
      const match = unidades.find(u =>
        u.nome.toLowerCase().includes(key) || key.includes(u.nome.toLowerCase())
      );
      if (match) {
        map.set(key, match.id);
      } else {
        // Create new unit
        const org = await prisma.organizacao.findFirst();
        const newUnit = await prisma.unidade.create({
          data: {
            codigo: name.substring(0, 10).toUpperCase().replace(/\s/g, "-"),
            nome: name,
            responsavel: "A definir",
            cidade: "Presidente Epitácio",
            uf: "SP",
            organizacaoId: org!.id,
          },
        });
        map.set(key, newUnit.id);
        console.log(`  Created unit: ${name} → ${newUnit.id}`);
      }
    }
  }

  return map;
}

async function migrate() {
  console.log("=== Migração do Sistema Legado ===\n");
  console.log(`Source: ${SOURCE_URL}`);
  console.log(`Target: ${TARGET_URL}\n`);

  // Step 1: Map units
  console.log("1. Mapeando unidades...");
  const unitMap = await getUnitMapping();
  console.log(`   ${unitMap.size} unidades mapeadas\n`);

  // Step 2: Get admin user for registradoPorId
  const admin = await prisma.usuario.findFirst({ where: { email: "admin@institutodalton.org.br" } });
  if (!admin) throw new Error("Admin user not found");

  // Step 3: Migrate participants
  console.log("2. Migrando participantes...");
  const { rows: participants } = await source.query("SELECT * FROM participants WHERE deleted_at IS NULL ORDER BY name");

  const idMap = new Map<string, string>(); // old UUID → new CUID
  let pCount = 0;

  for (const p of participants) {
    const unidadeId = unitMap.get((p.unit || "").toLowerCase());
    if (!unidadeId) {
      console.log(`   SKIP: ${p.name} — unit "${p.unit}" not mapped`);
      continue;
    }

    const participant = await prisma.participante.create({
      data: {
        nome: maskName(p.name),
        cpf: maskCpf(p.cpf),
        rg: p.rg ? p.rg.replace(/\d(?=\d{3})/g, "*") : null,
        dataNascimento: p.birth_date,
        telefone: maskPhone(p.phone),
        endereco: maskAddress(p.address),
        unidadeId,
        situacao: "ATIVO",
      },
    });

    idMap.set(p.id, participant.id);
    pCount++;
  }
  console.log(`   ${pCount} participantes migrados\n`);

  // Step 4: Migrate sub-tables
  console.log("3. Migrando sub-tabelas...");

  // Guardians
  const { rows: guardians } = await source.query("SELECT * FROM participant_guardians WHERE deleted_at IS NULL");
  let gCount = 0;
  for (const g of guardians) {
    const newId = idMap.get(g.participant_id);
    if (!newId) continue;
    await prisma.responsavelParticipante.create({
      data: {
        participanteId: newId,
        nome: g.name ? maskName(g.name) : null,
        parentesco: g.relationship,
        telefone: maskPhone(g.phone),
        trabalho: g.workplace,
        endereco: maskAddress(g.address),
      },
    });
    gCount++;
  }
  console.log(`   ${gCount} responsáveis`);

  // Health
  const { rows: health } = await source.query("SELECT * FROM participant_health WHERE deleted_at IS NULL");
  let hCount = 0;
  for (const h of health) {
    const newId = idMap.get(h.participant_id);
    if (!newId) continue;
    await prisma.saudeParticipante.create({
      data: {
        participanteId: newId,
        temProblemasSaude: h.has_health_issue || false,
        descricaoProblemasSaude: h.health_issue_description,
        temDeficiencia: h.has_disability || false,
        descricaoDeficiencia: h.disability_description,
        temAlergiaRemedio: h.has_medicine_allergy || false,
        descricaoAlergiaRemedio: h.medicine_allergy_description,
        temIntoleranciaAlimentar: h.has_food_intolerance || false,
        descricaoIntoleranciaAlimentar: h.food_intolerance_description,
        temMedicacaoRegular: h.has_regular_medicine || false,
        descricaoMedicacaoRegular: h.regular_medicine_description,
      },
    });
    hCount++;
  }
  console.log(`   ${hCount} saúde`);

  // Schools
  const { rows: schools } = await source.query("SELECT * FROM participant_schools WHERE deleted_at IS NULL");
  let sCount = 0;
  for (const s of schools) {
    const newId = idMap.get(s.participant_id);
    if (!newId) continue;
    await prisma.escolaParticipante.create({
      data: {
        participanteId: newId,
        nomeEscola: s.school_name,
        periodo: s.period,
        serie: s.grade,
      },
    });
    sCount++;
  }
  console.log(`   ${sCount} escolas`);

  // Housings
  const { rows: housings } = await source.query("SELECT * FROM participant_housings WHERE deleted_at IS NULL");
  let hoCount = 0;
  for (const ho of housings) {
    const newId = idMap.get(ho.participant_id);
    if (!newId) continue;

    const tipoMap: Record<string, "PROPRIO" | "ALUGADO" | "CEDIDO" | "OUTRO"> = {
      proprio: "PROPRIO", alugado: "ALUGADO", cedido: "CEDIDO", outro: "OUTRO",
    };

    await prisma.moradiaParticipante.create({
      data: {
        participanteId: newId,
        tipoImovel: tipoMap[ho.property_type?.toLowerCase()] || null,
        tipoImovelOutro: ho.property_type_other,
        valorAluguel: ho.rent_value,
        temAguaEncanada: ho.has_running_water || false,
        temEsgoto: ho.has_sewage || false,
        temEnergia: ho.has_electricity || false,
        nis: ho.nis,
        temBeneficios: ho.has_benefits || false,
        descricaoBeneficios: ho.benefits_description,
      },
    });
    hoCount++;
  }
  console.log(`   ${hoCount} moradias`);

  // Filiations
  const { rows: filiations } = await source.query("SELECT * FROM participant_filiations WHERE deleted_at IS NULL");
  let fCount = 0;
  for (const f of filiations) {
    const newId = idMap.get(f.participant_id);
    if (!newId) continue;
    await prisma.filiacaoParticipante.create({
      data: {
        participanteId: newId,
        nomeMae: f.mother_name ? maskName(f.mother_name) : null,
        telefoneMae: maskPhone(f.mother_phone),
        trabalhoMae: f.mother_workplace,
        nomePai: f.father_name ? maskName(f.father_name) : null,
        telefonePai: maskPhone(f.father_phone),
        trabalhoPai: f.father_workplace,
      },
    });
    fCount++;
  }
  console.log(`   ${fCount} filiações`);

  // Authorizations
  const { rows: auths } = await source.query("SELECT * FROM participant_authorizations WHERE deleted_at IS NULL");
  let aCount = 0;
  for (const a of auths) {
    const newId = idMap.get(a.participant_id);
    if (!newId) continue;
    await prisma.autorizacaoParticipante.create({
      data: {
        participanteId: newId,
        podeSairSozinho: a.can_leave_alone || false,
        nomeAutorizado: a.authorized_name ? maskName(a.authorized_name) : null,
        vinculoAutorizado: a.authorized_bond,
        telefoneAutorizado: maskPhone(a.authorized_phone),
      },
    });
    aCount++;
  }
  console.log(`   ${aCount} autorizações`);

  // Family members
  const { rows: family } = await source.query("SELECT * FROM participant_family_members WHERE deleted_at IS NULL");
  let fmCount = 0;
  for (const fm of family) {
    const newId = idMap.get(fm.participant_id);
    if (!newId) continue;
    await prisma.membroFamiliar.create({
      data: {
        participanteId: newId,
        nome: maskName(fm.name),
        parentesco: fm.relationship,
        idade: fm.age,
        profissao: fm.profession,
        renda: fm.income ? Number(fm.income) : null,
      },
    });
    fmCount++;
  }
  console.log(`   ${fmCount} membros familiares`);

  // Observations
  const { rows: obs } = await source.query("SELECT * FROM participant_observations WHERE deleted_at IS NULL");
  let oCount = 0;
  for (const o of obs) {
    const newId = idMap.get(o.participant_id);
    if (!newId) continue;
    await prisma.observacaoParticipante.create({
      data: {
        participanteId: newId,
        notas: o.notes,
      },
    });
    oCount++;
  }
  console.log(`   ${oCount} observações\n`);

  // Step 5: Migrate activities
  console.log("4. Migrando atividades...");
  const { rows: activities } = await source.query("SELECT * FROM activities WHERE deleted_at IS NULL ORDER BY name");

  const actIdMap = new Map<string, string>();
  const publicoMap: Record<string, "CRIANCAS" | "IDOSOS" | "AMBOS"> = {
    criancas: "CRIANCAS", idosos: "IDOSOS", ambos: "AMBOS",
  };

  for (const a of activities) {
    const unidadeId = unitMap.get((a.unit || "").toLowerCase()) || null;
    const atividade = await prisma.atividade.create({
      data: {
        nome: a.name,
        descricao: a.description,
        publicoAlvo: publicoMap[a.target_audience?.toLowerCase()] || "AMBOS",
        unidadeId,
      },
    });
    actIdMap.set(a.id, atividade.id);
  }
  console.log(`   ${actIdMap.size} atividades migradas\n`);

  // Step 6: Migrate activity_participant
  console.log("5. Migrando inscrições...");
  const { rows: enrollments } = await source.query("SELECT * FROM activity_participant");
  let eCount = 0;
  for (const e of enrollments) {
    const newActId = actIdMap.get(e.activity_id);
    const newPartId = idMap.get(e.participant_id);
    if (!newActId || !newPartId) continue;
    try {
      await prisma.atividadeParticipante.create({
        data: { atividadeId: newActId, participanteId: newPartId },
      });
      eCount++;
    } catch {
      // Duplicate — skip
    }
  }
  console.log(`   ${eCount} inscrições\n`);

  // Step 7: Migrate attendances
  console.log("6. Migrando presenças...");
  const { rows: attendances } = await source.query("SELECT * FROM attendances WHERE deleted_at IS NULL ORDER BY date");
  let attCount = 0;
  let attSkip = 0;

  for (const att of attendances) {
    const newActId = actIdMap.get(att.activity_id);
    const newPartId = idMap.get(att.participant_id);
    if (!newActId || !newPartId) { attSkip++; continue; }

    try {
      await prisma.presenca.create({
        data: {
          atividadeId: newActId,
          participanteId: newPartId,
          data: att.date,
          presente: att.is_present || false,
          observacao: att.observation,
          registradoPorId: admin.id,
        },
      });
      attCount++;
    } catch {
      attSkip++; // Duplicate — skip
    }
  }
  console.log(`   ${attCount} presenças migradas (${attSkip} ignoradas)\n`);

  // Verification
  console.log("=== Verificação ===");
  const counts = await Promise.all([
    prisma.participante.count(),
    prisma.atividade.count(),
    prisma.presenca.count(),
    prisma.responsavelParticipante.count(),
    prisma.saudeParticipante.count(),
    prisma.escolaParticipante.count(),
    prisma.moradiaParticipante.count(),
    prisma.filiacaoParticipante.count(),
    prisma.autorizacaoParticipante.count(),
    prisma.membroFamiliar.count(),
    prisma.observacaoParticipante.count(),
    prisma.atividadeParticipante.count(),
  ]);

  console.log(`Participantes:    ${counts[0]} (legado: ${participants.length})`);
  console.log(`Atividades:       ${counts[1]} (legado: ${activities.length})`);
  console.log(`Presenças:        ${counts[2]} (legado: ${attendances.length})`);
  console.log(`Responsáveis:     ${counts[3]}`);
  console.log(`Saúde:            ${counts[4]}`);
  console.log(`Escolas:          ${counts[5]}`);
  console.log(`Moradias:         ${counts[6]}`);
  console.log(`Filiações:        ${counts[7]}`);
  console.log(`Autorizações:     ${counts[8]}`);
  console.log(`Membros Fam.:     ${counts[9]}`);
  console.log(`Observações:      ${counts[10]}`);
  console.log(`Inscrições:       ${counts[11]}`);
  console.log("\n✅ Migração concluída!");

  await prisma.$disconnect();
  await source.end();
}

migrate().catch((err) => {
  console.error("❌ Erro na migração:", err);
  process.exit(1);
});
