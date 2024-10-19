import type { Person, SubjunctiveTense } from "./types";

const subjunctiveEndings: {
  [key in SubjunctiveTense]: {
    [key: string]: { [key in Person]: string };
  };
} = {
  Present: {
    ar: {
      yo: "e",
      tú: "es",
      "él/ella/Ud.": "e",
      nosotros: "emos",
      vosotros: "éis",
      "ellos/ellas/Uds.": "en",
    },
    er: {
      yo: "a",
      tú: "as",
      "él/ella/Ud.": "a",
      nosotros: "amos",
      vosotros: "áis",
      "ellos/ellas/Uds.": "an",
    },
    ir: {
      yo: "a",
      tú: "as",
      "él/ella/Ud.": "a",
      nosotros: "amos",
      vosotros: "áis",
      "ellos/ellas/Uds.": "an",
    },
  },
  ImperfectRA: {
    ar: {
      yo: "ara",
      tú: "aras",
      "él/ella/Ud.": "ara",
      nosotros: "áramos",
      vosotros: "arais",
      "ellos/ellas/Uds.": "aran",
    },
    er: {
      yo: "iera",
      tú: "ieras",
      "él/ella/Ud.": "iera",
      nosotros: "iéramos",
      vosotros: "ierais",
      "ellos/ellas/Uds.": "ieran",
    },
    ir: {
      yo: "iera",
      tú: "ieras",
      "él/ella/Ud.": "iera",
      nosotros: "iéramos",
      vosotros: "ierais",
      "ellos/ellas/Uds.": "ieran",
    },
  },
  ImperfectSE: {
    ar: {
      yo: "ase",
      tú: "ases",
      "él/ella/Ud.": "ase",
      nosotros: "ásemos",
      vosotros: "aseis",
      "ellos/ellas/Uds.": "asen",
    },
    er: {
      yo: "iese",
      tú: "ieses",
      "él/ella/Ud.": "iese",
      nosotros: "iésemos",
      vosotros: "ieseis",
      "ellos/ellas/Uds.": "iesen",
    },
    ir: {
      yo: "iese",
      tú: "ieses",
      "él/ella/Ud.": "iese",
      nosotros: "iésemos",
      vosotros: "ieseis",
      "ellos/ellas/Uds.": "iesen",
    },
  },
  Future: {
    ar: {
      yo: "ere",
      tú: "eres",
      "él/ella/Ud.": "ere",
      nosotros: "éremos",
      vosotros: "ereis",
      "ellos/ellas/Uds.": "eren",
    },
    er: {
      yo: "iere",
      tú: "ieres",
      "él/ella/Ud.": "iere",
      nosotros: "iéremos",
      vosotros: "iereis",
      "ellos/ellas/Uds.": "ieren",
    },
    ir: {
      yo: "iere",
      tú: "ieres",
      "él/ella/Ud.": "iere",
      nosotros: "iéremos",
      vosotros: "iereis",
      "ellos/ellas/Uds.": "ieren",
    },
  },
};

const getIrregularStemFromPreterite = (verb: string): string | null => {
  const preteriteStems: { [key: string]: string } = {
    tener: "tuv",
    estar: "estuv",
    andar: "anduv",
    poder: "pud",
    poner: "pus",
    saber: "sup",
    hacer: "hic",
    querer: "quis",
    venir: "vin",
    decir: "dij",
    traer: "traj",
    conducir: "conduj",
    producir: "produj",
    traducir: "traduj",
    caber: "cup",
    haber: "hub",
    ir: "fu",
    ser: "fu",
  };

  return preteriteStems[verb.toLowerCase()] || null;
};


const applyStemChangeSubjunctivePresent = (verb: string): string => {
  const verb_lower = verb.toLowerCase();
  const base = verb.slice(0, -2);

  // Handle spelling changes
  switch (true) {
    case verb.endsWith("car"):
      return `${base.slice(0, -1)}qu`;
    case verb.endsWith("gar"):
      return `${base.slice(0, -1)}gu`;
    case verb.endsWith("zar"):
      return `${base.slice(0, -1)}c`;
    case verb.endsWith("ger"):
    case verb.endsWith("gir"):
      return `${base.slice(0, -1)}j`;
    case verb.endsWith("cer"):
    case verb.endsWith("cir"):
      if (!["nacer", "hacer", "decir"].includes(verb_lower)) {
        return `${base.slice(0, -1)}zc`;
      }
      break;
    case verb.endsWith("uir"):
      return `${base}y`;
  }

  return base;
};

const applyStemChangeSubjunctiveImperfect = (verb: string): string => {
  // Use the preterite-based stem for irregular verbs
  const irregularStem = getIrregularStemFromPreterite(verb);
  if (irregularStem) {
    return irregularStem;
  }

  return verb.slice(0, -2);
};

export const conjugateSubjunctive = (
  verb: string,
  person: Person,
  tense: SubjunctiveTense
): string | null => {
  let stem: string;

  switch (tense) {
    case "Present":
      stem = applyStemChangeSubjunctivePresent(verb);
      break;
    case "ImperfectRA":
    case "ImperfectSE":
    case "Future":
      stem = applyStemChangeSubjunctiveImperfect(verb);
      break;
    default:
      return null;
  }

  const ending = verb.slice(-2);

  if (!subjunctiveEndings[tense]) return null;
  return stem + subjunctiveEndings[tense][ending][person];
};
