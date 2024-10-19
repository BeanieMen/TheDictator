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

export const conjugateSubjunctive = (
  verb: string,
  person: Person,
  tense: SubjunctiveTense,
  preIndStem: string, // the yo pro
  pretIndStem: string // the el/ella/ud pro
): string | null => {
  const stem = tense === "Present" ? preIndStem : pretIndStem
  const ending = verb.slice(-2);

  if (!subjunctiveEndings[tense]) return null;
  return stem + subjunctiveEndings[tense][ending][person];
};
