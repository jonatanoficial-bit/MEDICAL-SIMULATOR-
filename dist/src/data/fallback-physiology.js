// Fallback fisiológico interno da build v2.0.0.
export const FALLBACK_PHYSIOLOGY = Object.freeze({
  "schemaVersion": 1,
  "engineVersion": "2.0.0",
  "status": "development-only",
  "publishable": false,
  "validationPolicy": {
    "independentClinicalReviewRequired": true,
    "safetySimulationReviewRequired": true,
    "trilingualTerminologyReviewRequired": true,
    "commercialReleaseBlockedUntilApproved": true
  },
  "tick": {
    "realSecondsPerClinicalMinute": 12,
    "maxCatchupMinutes": 5,
    "autosaveEveryClinicalMinutes": 5
  },
  "actionTimeCost": {
    "questions": 3,
    "exams": 9,
    "procedures": 5,
    "hypotheses": 2,
    "conduct": 4,
    "reassessment": 2,
    "notes": 2
  },
  "disclaimer": {
    "pt-BR": "Modelo fisiológico educacional e determinístico. Não representa previsão clínica real nem substitui treinamento supervisionado.",
    "en": "Educational deterministic physiology model. It is not a real clinical prediction and does not replace supervised training.",
    "es": "Modelo fisiológico educativo y determinista. No representa una predicción clínica real ni sustituye la formación supervisada."
  },
  "profiles": [
    {
      "caseId": "hipertensao-1",
      "urgency": "low",
      "baseline": {
        "systolic": 128.0,
        "diastolic": 82.0,
        "heartRate": 88.0,
        "respiratoryRate": 18.0,
        "temperature": 36.7,
        "spo2": 98.0,
        "symptomSeverity": 38,
        "stabilityReserve": 82
      },
      "naturalCourse": {
        "per10Minutes": {
          "systolic": 0.7,
          "diastolic": 0.4,
          "heartRate": 0.5,
          "respiratoryRate": 0.1,
          "temperature": 0,
          "spo2": 0,
          "symptomSeverity": 0.8
        },
        "maxSafeMinutes": 90,
        "hardStopMinutes": 135
      },
      "thresholds": {
        "attention": {
          "stabilityReserveBelow": 55,
          "symptomSeverityAbove": 68
        },
        "unstable": {
          "stabilityReserveBelow": 30,
          "symptomSeverityAbove": 86,
          "spo2Below": 91,
          "heartRateAbove": 135
        }
      },
      "actionEffects": {
        "conduct": {
          "orientar estilo de vida": {
            "immediate": {
              "symptomSeverity": -4,
              "stabilityReserve": 4
            },
            "durationMinutes": 20
          },
          "monitorar pressão": {
            "immediate": {
              "symptomSeverity": -2,
              "stabilityReserve": 8
            },
            "durationMinutes": 30
          },
          "retorno ambulatorial": {
            "immediate": {
              "symptomSeverity": -2,
              "stabilityReserve": 5
            },
            "durationMinutes": 20
          }
        },
        "procedures": {
          "Aferir sinais vitais": {
            "observation": true
          },
          "Exame físico geral": {
            "observation": true
          },
          "Ausculta cardíaca": {
            "observation": true
          },
          "Ausculta pulmonar": {
            "observation": true
          },
          "Palpação abdominal": {
            "observation": true
          },
          "Avaliação neurológica": {
            "observation": true
          },
          "Solicitar acesso venoso": {
            "immediate": {
              "stabilityReserve": 3
            },
            "durationMinutes": 10
          }
        },
        "exams": {}
      },
      "outcomeRules": {
        "improvingSymptomBelow": 30,
        "worseningSymptomAbove": 72,
        "escalationAfterMinutes": 90
      }
    },
    {
      "caseId": "cefaleia-tensional",
      "urgency": "low",
      "baseline": {
        "systolic": 118.0,
        "diastolic": 76.0,
        "heartRate": 78.0,
        "respiratoryRate": 16.0,
        "temperature": 36.5,
        "spo2": 99.0,
        "symptomSeverity": 45,
        "stabilityReserve": 82
      },
      "naturalCourse": {
        "per10Minutes": {
          "systolic": 0.2,
          "diastolic": 0.1,
          "heartRate": 0.3,
          "respiratoryRate": 0.1,
          "temperature": 0,
          "spo2": 0,
          "symptomSeverity": 1.0
        },
        "maxSafeMinutes": 100,
        "hardStopMinutes": 145
      },
      "thresholds": {
        "attention": {
          "stabilityReserveBelow": 55,
          "symptomSeverityAbove": 68
        },
        "unstable": {
          "stabilityReserveBelow": 30,
          "symptomSeverityAbove": 86,
          "spo2Below": 91,
          "heartRateAbove": 135
        }
      },
      "actionEffects": {
        "conduct": {
          "analgesia simples": {
            "immediate": {
              "heartRate": -2,
              "symptomSeverity": -18,
              "stabilityReserve": 12
            },
            "durationMinutes": 25
          },
          "higiene do sono": {
            "immediate": {
              "symptomSeverity": -6,
              "stabilityReserve": 5
            },
            "durationMinutes": 30
          }
        },
        "procedures": {
          "Aferir sinais vitais": {
            "observation": true
          },
          "Exame físico geral": {
            "observation": true
          },
          "Ausculta cardíaca": {
            "observation": true
          },
          "Ausculta pulmonar": {
            "observation": true
          },
          "Palpação abdominal": {
            "observation": true
          },
          "Avaliação neurológica": {
            "observation": true
          },
          "Solicitar acesso venoso": {
            "immediate": {
              "stabilityReserve": 3
            },
            "durationMinutes": 10
          }
        },
        "exams": {}
      },
      "outcomeRules": {
        "improvingSymptomBelow": 30,
        "worseningSymptomAbove": 72,
        "escalationAfterMinutes": 100
      }
    },
    {
      "caseId": "angina-estavel",
      "urgency": "moderate",
      "baseline": {
        "systolic": 142.0,
        "diastolic": 88.0,
        "heartRate": 92.0,
        "respiratoryRate": 19.0,
        "temperature": 36.6,
        "spo2": 97.0,
        "symptomSeverity": 56,
        "stabilityReserve": 68
      },
      "naturalCourse": {
        "per10Minutes": {
          "systolic": 1.1,
          "diastolic": 0.5,
          "heartRate": 1.6,
          "respiratoryRate": 0.6,
          "temperature": 0,
          "spo2": -0.25,
          "symptomSeverity": 2.2
        },
        "maxSafeMinutes": 35,
        "hardStopMinutes": 80
      },
      "thresholds": {
        "attention": {
          "stabilityReserveBelow": 55,
          "symptomSeverityAbove": 68
        },
        "unstable": {
          "stabilityReserveBelow": 30,
          "symptomSeverityAbove": 86,
          "spo2Below": 91,
          "heartRateAbove": 135
        }
      },
      "actionEffects": {
        "conduct": {
          "ECG seriado": {
            "immediate": {
              "symptomSeverity": -3,
              "stabilityReserve": 10
            },
            "durationMinutes": 15
          },
          "estratificação de risco": {
            "immediate": {
              "symptomSeverity": -4,
              "stabilityReserve": 15
            },
            "durationMinutes": 30
          },
          "encaminhar cardiologia": {
            "immediate": {
              "heartRate": -4,
              "respiratoryRate": -1,
              "symptomSeverity": -8,
              "stabilityReserve": 22
            },
            "durationMinutes": 40
          }
        },
        "procedures": {
          "Aferir sinais vitais": {
            "observation": true
          },
          "Exame físico geral": {
            "observation": true
          },
          "Ausculta cardíaca": {
            "observation": true
          },
          "Ausculta pulmonar": {
            "observation": true
          },
          "Palpação abdominal": {
            "observation": true
          },
          "Avaliação neurológica": {
            "observation": true
          },
          "Solicitar acesso venoso": {
            "immediate": {
              "stabilityReserve": 3
            },
            "durationMinutes": 10
          }
        },
        "exams": {}
      },
      "outcomeRules": {
        "improvingSymptomBelow": 30,
        "worseningSymptomAbove": 72,
        "escalationAfterMinutes": 35
      }
    },
    {
      "caseId": "itu-nao-complicada",
      "urgency": "low",
      "baseline": {
        "systolic": 116.0,
        "diastolic": 74.0,
        "heartRate": 84.0,
        "respiratoryRate": 17.0,
        "temperature": 37.2,
        "spo2": 99.0,
        "symptomSeverity": 44,
        "stabilityReserve": 82
      },
      "naturalCourse": {
        "per10Minutes": {
          "systolic": -0.1,
          "diastolic": -0.1,
          "heartRate": 0.6,
          "respiratoryRate": 0.1,
          "temperature": 0.06,
          "spo2": 0,
          "symptomSeverity": 1.1
        },
        "maxSafeMinutes": 100,
        "hardStopMinutes": 145
      },
      "thresholds": {
        "attention": {
          "stabilityReserveBelow": 55,
          "symptomSeverityAbove": 68
        },
        "unstable": {
          "stabilityReserveBelow": 30,
          "symptomSeverityAbove": 86,
          "spo2Below": 91,
          "heartRateAbove": 135
        }
      },
      "actionEffects": {
        "conduct": {
          "antibioticoterapia guiada": {
            "immediate": {
              "temperature": -0.15,
              "symptomSeverity": -12,
              "stabilityReserve": 15
            },
            "durationMinutes": 35
          },
          "hidratação": {
            "immediate": {
              "heartRate": -2,
              "symptomSeverity": -6,
              "stabilityReserve": 8
            },
            "durationMinutes": 25
          }
        },
        "procedures": {
          "Aferir sinais vitais": {
            "observation": true
          },
          "Exame físico geral": {
            "observation": true
          },
          "Ausculta cardíaca": {
            "observation": true
          },
          "Ausculta pulmonar": {
            "observation": true
          },
          "Palpação abdominal": {
            "observation": true
          },
          "Avaliação neurológica": {
            "observation": true
          },
          "Solicitar acesso venoso": {
            "immediate": {
              "stabilityReserve": 3
            },
            "durationMinutes": 10
          }
        },
        "exams": {}
      },
      "outcomeRules": {
        "improvingSymptomBelow": 30,
        "worseningSymptomAbove": 72,
        "escalationAfterMinutes": 100
      }
    },
    {
      "caseId": "refluxo-gastroesofagico",
      "urgency": "low",
      "baseline": {
        "systolic": 122.0,
        "diastolic": 80.0,
        "heartRate": 82.0,
        "respiratoryRate": 17.0,
        "temperature": 36.6,
        "spo2": 98.0,
        "symptomSeverity": 42,
        "stabilityReserve": 82
      },
      "naturalCourse": {
        "per10Minutes": {
          "systolic": 0,
          "diastolic": 0,
          "heartRate": 0.3,
          "respiratoryRate": 0.1,
          "temperature": 0,
          "spo2": 0,
          "symptomSeverity": 0.8
        },
        "maxSafeMinutes": 110,
        "hardStopMinutes": 155
      },
      "thresholds": {
        "attention": {
          "stabilityReserveBelow": 55,
          "symptomSeverityAbove": 68
        },
        "unstable": {
          "stabilityReserveBelow": 30,
          "symptomSeverityAbove": 86,
          "spo2Below": 91,
          "heartRateAbove": 135
        }
      },
      "actionEffects": {
        "conduct": {
          "inibidor de bomba de prótons": {
            "immediate": {
              "symptomSeverity": -14,
              "stabilityReserve": 12
            },
            "durationMinutes": 35
          },
          "evitar gatilhos alimentares": {
            "immediate": {
              "symptomSeverity": -6,
              "stabilityReserve": 5
            },
            "durationMinutes": 25
          },
          "retorno ambulatorial": {
            "immediate": {
              "symptomSeverity": -2,
              "stabilityReserve": 4
            },
            "durationMinutes": 20
          }
        },
        "procedures": {
          "Aferir sinais vitais": {
            "observation": true
          },
          "Exame físico geral": {
            "observation": true
          },
          "Ausculta cardíaca": {
            "observation": true
          },
          "Ausculta pulmonar": {
            "observation": true
          },
          "Palpação abdominal": {
            "observation": true
          },
          "Avaliação neurológica": {
            "observation": true
          },
          "Solicitar acesso venoso": {
            "immediate": {
              "stabilityReserve": 3
            },
            "durationMinutes": 10
          }
        },
        "exams": {}
      },
      "outcomeRules": {
        "improvingSymptomBelow": 30,
        "worseningSymptomAbove": 72,
        "escalationAfterMinutes": 110
      }
    },
    {
      "caseId": "dermatite-atopica",
      "urgency": "low",
      "baseline": {
        "systolic": 110.0,
        "diastolic": 72.0,
        "heartRate": 76.0,
        "respiratoryRate": 16.0,
        "temperature": 36.4,
        "spo2": 99.0,
        "symptomSeverity": 40,
        "stabilityReserve": 82
      },
      "naturalCourse": {
        "per10Minutes": {
          "systolic": 0,
          "diastolic": 0,
          "heartRate": 0.2,
          "respiratoryRate": 0,
          "temperature": 0,
          "spo2": 0,
          "symptomSeverity": 0.7
        },
        "maxSafeMinutes": 120,
        "hardStopMinutes": 165
      },
      "thresholds": {
        "attention": {
          "stabilityReserveBelow": 55,
          "symptomSeverityAbove": 68
        },
        "unstable": {
          "stabilityReserveBelow": 30,
          "symptomSeverityAbove": 86,
          "spo2Below": 91,
          "heartRateAbove": 135
        }
      },
      "actionEffects": {
        "conduct": {
          "hidratação da pele": {
            "immediate": {
              "symptomSeverity": -12,
              "stabilityReserve": 10
            },
            "durationMinutes": 35
          },
          "corticoide tópico leve": {
            "immediate": {
              "symptomSeverity": -15,
              "stabilityReserve": 14
            },
            "durationMinutes": 35
          },
          "retorno ambulatorial": {
            "immediate": {
              "symptomSeverity": -2,
              "stabilityReserve": 4
            },
            "durationMinutes": 20
          }
        },
        "procedures": {
          "Aferir sinais vitais": {
            "observation": true
          },
          "Exame físico geral": {
            "observation": true
          },
          "Ausculta cardíaca": {
            "observation": true
          },
          "Ausculta pulmonar": {
            "observation": true
          },
          "Palpação abdominal": {
            "observation": true
          },
          "Avaliação neurológica": {
            "observation": true
          },
          "Solicitar acesso venoso": {
            "immediate": {
              "stabilityReserve": 3
            },
            "durationMinutes": 10
          }
        },
        "exams": {}
      },
      "outcomeRules": {
        "improvingSymptomBelow": 30,
        "worseningSymptomAbove": 72,
        "escalationAfterMinutes": 120
      }
    }
  ]
});
