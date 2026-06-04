import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TRANSLATION_PATH = join(__dirname, "..", "data", "label-translations.json");
const KAMUS_PATH = join(__dirname, "..", "data", "kamus_gejala_diagnoku.json");

const translationData = JSON.parse(readFileSync(TRANSLATION_PATH, "utf-8"));
const kamusData = JSON.parse(readFileSync(KAMUS_PATH, "utf-8"));

const symptomMap = translationData.symptoms || {};
const diseaseMap = translationData.diseases || {};
const symptomAliasMap = buildSymptomAliasMap(kamusData, symptomMap);
const reverseSymptomMap = Object.fromEntries(
  Object.entries(symptomMap).map(([en, id]) => [normalizeLabel(id), en]),
);
const reverseDiseaseMap = Object.fromEntries(
  Object.entries(diseaseMap).map(([en, id]) => [normalizeLabel(id), en]),
);

function normalizeLabel(label) {
  return String(label).toLowerCase().trim();
}

function buildSymptomAliasMap(dictionary, canonicalMap) {
  const aliasMap = {};

  for (const [englishLabel, aliases] of Object.entries(dictionary || {})) {
    aliasMap[normalizeLabel(englishLabel)] = englishLabel;

    if (Array.isArray(aliases)) {
      for (const alias of aliases) {
        aliasMap[normalizeLabel(alias)] = englishLabel;
      }
    }
  }

  for (const [englishLabel, indonesianLabel] of Object.entries(canonicalMap || {})) {
    aliasMap[normalizeLabel(indonesianLabel)] = englishLabel;
    aliasMap[normalizeLabel(englishLabel)] = englishLabel;
  }

  return aliasMap;
}

export function translateSymptom(label) {
  const normalized = normalizeLabel(label);
  return symptomMap[normalized] || label;
}

export function translateDisease(label) {
  const normalized = normalizeLabel(label);
  return diseaseMap[normalized] || label;
}

export function normalizeSymptomInput(label) {
  const normalized = normalizeLabel(label);
  return symptomAliasMap[normalized] || reverseSymptomMap[normalized] || normalized;
}

export function normalizeDiseaseInput(label) {
  const normalized = normalizeLabel(label);
  return reverseDiseaseMap[normalized] || normalized;
}

export function getSymptomSuggestions() {
  const suggestions = new Set();

  for (const [englishLabel, aliases] of Object.entries(kamusData || {})) {
    const aliasList = Array.isArray(aliases) ? aliases : [];
    const canonical = translateSymptom(englishLabel);

    for (const alias of aliasList) {
      const normalizedAlias = normalizeLabel(alias);
      if (normalizedAlias) {
        suggestions.add(normalizedAlias);
      }
    }

    if (canonical && canonical !== englishLabel) {
      suggestions.add(normalizeLabel(canonical));
    } else if (aliasList.length === 0 && englishLabel) {
      suggestions.add(normalizeLabel(englishLabel));
    }
  }

  return Array.from(suggestions).filter(Boolean).sort((a, b) => a.localeCompare(b, "id"));
}
