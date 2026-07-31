// Fallback de governança médica gerado a partir do registro oficial da build.
export const FALLBACK_GOVERNANCE = Object.freeze({
  "schemaVersion": 1,
  "contentVersion": "1.0.0",
  "releaseChannel": "development",
  "policy": {
    "productScope": "educational-clinical-simulation",
    "medicalAdvice": false,
    "commercialReleaseRequiresAllActiveCasesApproved": true,
    "approvedStatuses": [
      "clinically-approved"
    ],
    "developmentPlayableStatuses": [
      "reference-mapped",
      "clinical-review",
      "clinically-approved"
    ],
    "reviewIntervalMonths": 12,
    "sourceFreshnessCheckRequired": true,
    "overdueAction": "block-release",
    "missingReviewerAction": "block-release",
    "missingSourceAction": "block-case",
    "disclaimer": {
      "pt-BR": "Conteúdo educacional. Não substitui avaliação, diagnóstico, tratamento ou treinamento profissional supervisionado.",
      "en": "Educational content. It does not replace professional assessment, diagnosis, treatment, or supervised clinical training.",
      "es": "Contenido educativo. No sustituye la evaluación, el diagnóstico, el tratamiento ni la formación clínica profesional supervisada."
    }
  },
  "reviewRoles": [
    {
      "id": "clinical-owner",
      "name": "Responsável clínico",
      "requiredForApproval": true
    },
    {
      "id": "medical-reviewer",
      "name": "Revisor médico independente",
      "requiredForApproval": true
    },
    {
      "id": "translation-reviewer",
      "name": "Revisor de terminologia médica",
      "requiredForApproval": true
    },
    {
      "id": "qa-reviewer",
      "name": "Auditoria de simulação e segurança",
      "requiredForApproval": true
    }
  ],
  "sources": [
    {
      "id": "WHO-PATIENT-SAFETY-2011",
      "title": "Patient Safety Curriculum Guide: Multi-professional Edition",
      "organization": "World Health Organization",
      "year": 2011,
      "region": "global",
      "type": "education-safety-framework",
      "url": "https://www.who.int/teams/integrated-health-services/patient-safety/guidance/curriculum-guide-tools/resources",
      "accessedAt": "2026-06-12T17:00:59-03:00",
      "status": "active",
      "notes": "Referência transversal para segurança do paciente, comunicação, prevenção de erros e debriefing educacional."
    },
    {
      "id": "AHA-ACC-HBP-2025",
      "title": "2025 Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults",
      "organization": "American Heart Association / American College of Cardiology",
      "year": 2025,
      "region": "United States / international reference",
      "type": "clinical-practice-guideline",
      "url": "https://professional.heart.org/en/science-news/2025-high-blood-pressure-guideline",
      "accessedAt": "2026-06-12T17:00:59-03:00",
      "status": "active",
      "notes": "Substitui a diretriz ACC/AHA de 2017 e deve ser confrontada com protocolos locais antes da publicação regional."
    },
    {
      "id": "IHS-ICHD3-TTH",
      "title": "International Classification of Headache Disorders, 3rd edition — Tension-type headache",
      "organization": "International Headache Society",
      "year": 2018,
      "region": "global",
      "type": "diagnostic-classification",
      "url": "https://ichd-3.org/2-tension-type-headache/",
      "accessedAt": "2026-06-12T17:00:59-03:00",
      "status": "active",
      "notes": "Critérios diagnósticos devem ser aplicados conforme frequência, duração, características e exclusão de sinais secundários."
    },
    {
      "id": "ESC-CCS-2024",
      "title": "2024 ESC Guidelines for the management of chronic coronary syndromes",
      "organization": "European Society of Cardiology",
      "year": 2024,
      "region": "Europe / international reference",
      "type": "clinical-practice-guideline",
      "url": "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/chronic-coronary-syndromes/",
      "accessedAt": "2026-06-12T17:00:59-03:00",
      "status": "active",
      "notes": "Abrange suspeita, diagnóstico, estratificação e manejo longitudinal de síndromes coronarianas crônicas."
    },
    {
      "id": "EAU-UTI-2026",
      "title": "EAU Guidelines on Urological Infections",
      "organization": "European Association of Urology",
      "year": 2026,
      "region": "Europe / international reference",
      "type": "clinical-practice-guideline",
      "url": "https://uroweb.org/guidelines/urological-infections",
      "accessedAt": "2026-06-12T17:00:59-03:00",
      "status": "active",
      "notes": "A edição de 2026 usa classificação centrada em infecção localizada ou sistêmica; o rótulo legado “não complicada” exige revisão."
    },
    {
      "id": "ACG-GERD-2022",
      "title": "ACG Clinical Guideline for the Diagnosis and Management of Gastroesophageal Reflux Disease",
      "organization": "American College of Gastroenterology",
      "year": 2022,
      "region": "United States / international reference",
      "type": "clinical-practice-guideline",
      "url": "https://pubmed.ncbi.nlm.nih.gov/34807007/",
      "accessedAt": "2026-06-12T17:00:59-03:00",
      "status": "active",
      "notes": "Referência para avaliação, teste terapêutico, sinais de alarme e indicação de investigação objetiva."
    },
    {
      "id": "AAD-AD-TOPICAL-2023",
      "title": "Guidelines of care for the management of atopic dermatitis in adults with topical therapies",
      "organization": "American Academy of Dermatology",
      "year": 2023,
      "region": "United States / international reference",
      "type": "clinical-practice-guideline",
      "url": "https://www.aad.org/member/clinical-quality/guidelines/atopic-dermatitis",
      "accessedAt": "2026-06-12T17:00:59-03:00",
      "status": "active",
      "notes": "Inclui recomendações baseadas em evidência para hidratantes e terapias tópicas; escolha e potência exigem contexto clínico."
    },
    {
      "id": "AHA-CPR-ECC-2025",
      "title": "2025 American Heart Association Guidelines for CPR and Emergency Cardiovascular Care",
      "organization": "American Heart Association",
      "year": 2025,
      "region": "United States / international reference",
      "type": "resuscitation-guideline",
      "url": "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines",
      "accessedAt": "2026-06-12T17:15:20-03:00",
      "status": "active",
      "notes": "Usada na Academia para reconhecimento de emergência e princípios de resposta; habilidades práticas exigem treinamento certificado."
    },
    {
      "id": "AHRQ-SBAR-TEAMSTEPPS",
      "title": "TeamSTEPPS 3.0 — SBAR Communication Tool",
      "organization": "Agency for Healthcare Research and Quality",
      "year": 2023,
      "region": "United States / international education reference",
      "type": "communication-safety-framework",
      "url": "https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/sbar.html",
      "accessedAt": "2026-06-12T17:15:20-03:00",
      "status": "active",
      "notes": "Estrutura Situation, Background, Assessment and Recommendation para comunicação segura e concisa."
    },
    {
      "id": "CDC-MEDICATION-SAFETY-2024",
      "title": "Medication Safety and Your Health",
      "organization": "Centers for Disease Control and Prevention",
      "year": 2024,
      "region": "United States / public safety reference",
      "type": "medication-safety-guidance",
      "url": "https://www.cdc.gov/medication-safety/about/index.html",
      "accessedAt": "2026-06-12T17:15:20-03:00",
      "status": "active",
      "notes": "Referência para eventos adversos, uso conforme prescrição e prevenção de dano relacionado a medicamentos."
    },
    {
      "id": "CDC-DIAGNOSTIC-EXCELLENCE-2026",
      "title": "Core Elements of Hospital Diagnostic Excellence",
      "organization": "Centers for Disease Control and Prevention",
      "year": 2026,
      "region": "United States / quality improvement reference",
      "type": "diagnostic-safety-framework",
      "url": "https://www.cdc.gov/patient-safety/hcp/hospital-dx-excellence/index.html",
      "accessedAt": "2026-06-12T17:15:20-03:00",
      "status": "active",
      "notes": "Referência de qualidade para melhorar processos diagnósticos, monitorar resultados e reduzir dano."
    }
  ],
  "cases": {
    "hipertensao-1": {
      "status": "reference-mapped",
      "publishable": false,
      "educationUse": "development-only",
      "review": {
        "mappedAt": "2026-06-12T17:00:59-03:00",
        "clinicalReviewedAt": null,
        "translationReviewedAt": null,
        "qaReviewedAt": null,
        "nextReviewAt": null
      },
      "reviewers": {
        "clinicalOwner": null,
        "medicalReviewer": null,
        "translationReviewers": {
          "pt-BR": null,
          "en": null,
          "es": null
        },
        "qaReviewer": null
      },
      "changeHistory": [
        {
          "at": "2026-06-12T17:00:59-03:00",
          "build": "0.17.0",
          "action": "source-mapping",
          "status": "reference-mapped"
        }
      ],
      "caseId": "hipertensao-1",
      "region": "United States reference; localization pending",
      "sourceIds": [
        "AHA-ACC-HBP-2025",
        "WHO-PATIENT-SAFETY-2011"
      ],
      "riskFlags": [
        "diagnostic-label-conflicts-with-single-office-reading",
        "chest-discomfort-requires-differential-review"
      ],
      "reviewNotes": [
        "PA 128/82 isolada não deve confirmar automaticamente “Hipertensão Arterial Estágio 1”. Revisar diagnóstico, medidas repetidas e diferencial de dor torácica."
      ]
    },
    "cefaleia-tensional": {
      "status": "reference-mapped",
      "publishable": false,
      "educationUse": "development-only",
      "review": {
        "mappedAt": "2026-06-12T17:00:59-03:00",
        "clinicalReviewedAt": null,
        "translationReviewedAt": null,
        "qaReviewedAt": null,
        "nextReviewAt": null
      },
      "reviewers": {
        "clinicalOwner": null,
        "medicalReviewer": null,
        "translationReviewers": {
          "pt-BR": null,
          "en": null,
          "es": null
        },
        "qaReviewer": null
      },
      "changeHistory": [
        {
          "at": "2026-06-12T17:00:59-03:00",
          "build": "0.17.0",
          "action": "source-mapping",
          "status": "reference-mapped"
        }
      ],
      "caseId": "cefaleia-tensional",
      "region": "global diagnostic classification",
      "sourceIds": [
        "IHS-ICHD3-TTH",
        "WHO-PATIENT-SAFETY-2011"
      ],
      "riskFlags": [
        "headache-red-flags-required",
        "frequency-subtype-not-defined"
      ],
      "reviewNotes": [
        "Definir subtipo por frequência/duração e manter exclusão explícita de causas secundárias e sinais de alarme."
      ]
    },
    "angina-estavel": {
      "status": "reference-mapped",
      "publishable": false,
      "educationUse": "development-only",
      "review": {
        "mappedAt": "2026-06-12T17:00:59-03:00",
        "clinicalReviewedAt": null,
        "translationReviewedAt": null,
        "qaReviewedAt": null,
        "nextReviewAt": null
      },
      "reviewers": {
        "clinicalOwner": null,
        "medicalReviewer": null,
        "translationReviewers": {
          "pt-BR": null,
          "en": null,
          "es": null
        },
        "qaReviewer": null
      },
      "changeHistory": [
        {
          "at": "2026-06-12T17:00:59-03:00",
          "build": "0.17.0",
          "action": "source-mapping",
          "status": "reference-mapped"
        }
      ],
      "caseId": "angina-estavel",
      "region": "Europe reference; localization pending",
      "sourceIds": [
        "ESC-CCS-2024",
        "WHO-PATIENT-SAFETY-2011"
      ],
      "riskFlags": [
        "acute-coronary-syndrome-must-be-excluded",
        "single-negative-troponin-not-definitive"
      ],
      "reviewNotes": [
        "Sintomas com irradiação e sudorese exigem fluxo de segurança para descartar síndrome coronariana aguda antes de classificar como estável."
      ]
    },
    "itu-nao-complicada": {
      "status": "reference-mapped",
      "publishable": false,
      "educationUse": "development-only",
      "review": {
        "mappedAt": "2026-06-12T17:00:59-03:00",
        "clinicalReviewedAt": null,
        "translationReviewedAt": null,
        "qaReviewedAt": null,
        "nextReviewAt": null
      },
      "reviewers": {
        "clinicalOwner": null,
        "medicalReviewer": null,
        "translationReviewers": {
          "pt-BR": null,
          "en": null,
          "es": null
        },
        "qaReviewer": null
      },
      "changeHistory": [
        {
          "at": "2026-06-12T17:00:59-03:00",
          "build": "0.17.0",
          "action": "source-mapping",
          "status": "reference-mapped"
        }
      ],
      "caseId": "itu-nao-complicada",
      "region": "Europe reference; terminology localization pending",
      "sourceIds": [
        "EAU-UTI-2026",
        "WHO-PATIENT-SAFETY-2011"
      ],
      "riskFlags": [
        "legacy-uti-classification",
        "antimicrobial-stewardship-required",
        "pregnancy-status-critical"
      ],
      "reviewNotes": [
        "Revisar o rótulo “não complicada” diante da classificação EAU 2026 e detalhar critérios para cultura, gestação e sinais sistêmicos."
      ]
    },
    "refluxo-gastroesofagico": {
      "status": "reference-mapped",
      "publishable": false,
      "educationUse": "development-only",
      "review": {
        "mappedAt": "2026-06-12T17:00:59-03:00",
        "clinicalReviewedAt": null,
        "translationReviewedAt": null,
        "qaReviewedAt": null,
        "nextReviewAt": null
      },
      "reviewers": {
        "clinicalOwner": null,
        "medicalReviewer": null,
        "translationReviewers": {
          "pt-BR": null,
          "en": null,
          "es": null
        },
        "qaReviewer": null
      },
      "changeHistory": [
        {
          "at": "2026-06-12T17:00:59-03:00",
          "build": "0.17.0",
          "action": "source-mapping",
          "status": "reference-mapped"
        }
      ],
      "caseId": "refluxo-gastroesofagico",
      "region": "United States reference; localization pending",
      "sourceIds": [
        "ACG-GERD-2022",
        "WHO-PATIENT-SAFETY-2011"
      ],
      "riskFlags": [
        "alarm-features-must-change-pathway",
        "cardiac-differential-for-chest-burning"
      ],
      "reviewNotes": [
        "Manter sinais de alarme e diferencial cardíaco explícitos; endoscopia não deve aparecer como rotina obrigatória em todos os casos."
      ]
    },
    "dermatite-atopica": {
      "status": "reference-mapped",
      "publishable": false,
      "educationUse": "development-only",
      "review": {
        "mappedAt": "2026-06-12T17:00:59-03:00",
        "clinicalReviewedAt": null,
        "translationReviewedAt": null,
        "qaReviewedAt": null,
        "nextReviewAt": null
      },
      "reviewers": {
        "clinicalOwner": null,
        "medicalReviewer": null,
        "translationReviewers": {
          "pt-BR": null,
          "en": null,
          "es": null
        },
        "qaReviewer": null
      },
      "changeHistory": [
        {
          "at": "2026-06-12T17:00:59-03:00",
          "build": "0.17.0",
          "action": "source-mapping",
          "status": "reference-mapped"
        }
      ],
      "caseId": "dermatite-atopica",
      "region": "United States reference; localization pending",
      "sourceIds": [
        "AAD-AD-TOPICAL-2023",
        "WHO-PATIENT-SAFETY-2011"
      ],
      "riskFlags": [
        "topical-potency-site-duration-required",
        "infection-red-flags-required"
      ],
      "reviewNotes": [
        "A potência, local e duração de corticoide tópico devem ser definidos; incluir sinais de infecção e critérios de encaminhamento."
      ]
    }
  },
  "auditTrail": [
    {
      "at": "2026-06-12T17:00:59-03:00",
      "actor": "build-system",
      "action": "governance-registry-created",
      "build": "0.17.0",
      "detail": "Fontes oficiais mapeadas. Nenhum caso recebeu aprovação clínica automática."
    }
  ]
});
