import type { Person, Tense } from "./types";

const verbEndings: {
  [key in Tense]?: {
    [key: string]: { [key in Person]: string };
  };
} = {
  Present: {
    ar: {
      yo: "o",
      tú: "ás",
      "él/ella/Ud.": "á",
      nosotros: "amos",
      vosotros: "áis",
      "ellos/ellas/Uds.": "án",
    },
    er: {
      yo: "o",
      tú: "es",
      "él/ella/Ud.": "e",
      nosotros: "emos",
      vosotros: "éis",
      "ellos/ellas/Uds.": "en",
    },
    ir: {
      yo: "o",
      tú: "es",
      "él/ella/Ud.": "e",
      nosotros: "imos",
      vosotros: "ís",
      "ellos/ellas/Uds.": "en",
    },
  },
  Preterite: {
    ar: {
      yo: "e",
      tú: "aste",
      "él/ella/Ud.": "o",
      nosotros: "amos",
      vosotros: "asteis",
      "ellos/ellas/Uds.": "aron",
    },
    er: {
      yo: "e",
      tú: "iste",
      "él/ella/Ud.": "o",
      nosotros: "imos",
      vosotros: "isteis",
      "ellos/ellas/Uds.": "ieron",
    },
    ir: {
      yo: "e",
      tú: "iste",
      "él/ella/Ud.": "o",
      nosotros: "imos",
      vosotros: "isteis",
      "ellos/ellas/Uds.": "ieron",
    },
  },
  Imperfect: {
    ar: {
      yo: "aba",
      tú: "abas",
      "él/ella/Ud.": "aba",
      nosotros: "ábamos",
      vosotros: "abais",
      "ellos/ellas/Uds.": "aban",
    },
    er: {
      yo: "ía",
      tú: "ías",
      "él/ella/Ud.": "ía",
      nosotros: "íamos",
      vosotros: "íais",
      "ellos/ellas/Uds.": "ían",
    },
    ir: {
      yo: "ía",
      tú: "ías",
      "él/ella/Ud.": "ía",
      nosotros: "íamos",
      vosotros: "íais",
      "ellos/ellas/Uds.": "ían",
    },
  },
  Future: {
    ar: {
      yo: "é",
      tú: "ás",
      "él/ella/Ud.": "á",
      nosotros: "emos",
      vosotros: "éis",
      "ellos/ellas/Uds.": "án",
    },
    er: {
      yo: "é",
      tú: "ás",
      "él/ella/Ud.": "á",
      nosotros: "emos",
      vosotros: "éis",
      "ellos/ellas/Uds.": "án",
    },
    ir: {
      yo: "é",
      tú: "ás",
      "él/ella/Ud.": "á",
      nosotros: "emos",
      vosotros: "éis",
      "ellos/ellas/Uds.": "án",
    },
  },
  Conditional: {
    ar: {
      yo: "ía",
      tú: "ías",
      "él/ella/Ud.": "ía",
      nosotros: "íamos",
      vosotros: "íais",
      "ellos/ellas/Uds.": "ían",
    },
    er: {
      yo: "ía",
      tú: "ías",
      "él/ella/Ud.": "ía",
      nosotros: "íamos",
      vosotros: "íais",
      "ellos/ellas/Uds.": "ían",
    },
    ir: {
      yo: "ía",
      tú: "ías",
      "él/ella/Ud.": "ía",
      nosotros: "íamos",
      vosotros: "íais",
      "ellos/ellas/Uds.": "ían",
    },
  },
};

const irregularStemsPresent: { [key: string]: string } = {
  ir: "v",
  ser: "s",
  estar: "est",
  haber: "h",
  tener: "tien",
  venir: "vien",
  poder: "pued",
  querer: "quier",
  decir: "dic",
  hacer: "hac",
  poner: "pon",
  saber: "sab",
  traer: "tra",
  dar: "d",
  ver: "ve",
  sentir: "sient",
  dormir: "duerm",
  morir: "muer",
  pensar: "piens",
  perder: "pierd",
  encontrar: "encuentr",
  volver: "vuelv",
  contar: "cuent",
  mostrar: "muestr",
  recordar: "recuerd",
  mover: "muev",
  almorzar: "almuerz",
  jugar: "jueg",
  pedir: "pid",
  servir: "sirv",
  repetir: "repit",
  seguir: "sig",
  conseguir: "consig",
  preferir: "prefier",
};

const irregularStemsPreterite: { [key: string]: string } = {
  poder: "pud",
  poner: "pus",
  saber: "sup",
  querer: "quis",
  venir: "vin",
  tener: "tuv",
  estar: "estuv",
  hacer: "hic",
  decir: "dij",
  traer: "traj",
  andar: "anduv",
  caber: "cup",
  haber: "hub",
  producir: "produj",
  conducir: "conduj",
  traducir: "traduj",
  dormir: "durm",
  morir: "mur",
  ir: "fu",
  ser: "fu",
  dar: "d",
  ver: "v",
  caer: "cay",
  oír: "oy",
  leer: "ley",
  sentir: "sint",
  convertir: "convirt",
  mentir: "mint",
  preferir: "prefir",
};

const irregularStemsImperfect: { [key: string]: string } = {
  ir: "i",
  ver: "ve",
  ser: "er",
};
const irregularStemsFutureConditional: { [key: string]: string } = {
  decir: "dir",
  hacer: "har",
  poder: "podr",
  poner: "pondr",
  querer: "querr",
  saber: "sabr",
  salir: "saldr",
  tener: "tendr",
  valer: "valdr",
  venir: "vendr",
  haber: "habr",
  caber: "cabr",
};


const applyStemChangePresent = (verb: string): string => {
  const verb_lower = verb.toLowerCase();
  if (irregularStemsPresent[verb_lower]) {
    return irregularStemsPresent[verb_lower];
  }

  const base = verb.slice(0, -2);

  switch (true) {
    case verb.endsWith("ucir"):
      return `${base.slice(0, -2)}zc`;
    case verb.endsWith("uir"):
      return `${base}y`;
    case verb.endsWith("eer"):
      return base;
    case verb.endsWith("iar"):
      return `${base}í`;
    case verb.endsWith("uar"):
      return `${base}ú`;
    case verb.endsWith("ir"):
    case verb.endsWith("ar"):
    case verb.endsWith("er"):
      if (base.match(/[eo][^aeiou]*$/)) {
        const lastVowel = base.match(/[eo]/g)?.pop();
        const stemChange = {
          e: "ie",
          o: "ue",
        }[lastVowel || ""];

        if (stemChange) {
          const vowelPos = base.lastIndexOf(lastVowel || "");
          return (
            base.substring(0, vowelPos) +
            stemChange +
            base.substring(vowelPos + 1)
          );
        }
      }
      break;
  }

  return base;
};

const applyStemChangePreterite = (verb: string): string => {
  const verb_lower = verb.toLowerCase();
  if (irregularStemsPreterite[verb_lower]) {
    return irregularStemsPreterite[verb_lower];
  }

  const base = verb.slice(0, -2);

  switch (true) {
    case verb.endsWith("ucir"):
      return `${base.slice(0, -2)}j`;
    case verb.endsWith("uir"):
      return `${base}y`;
    case verb.endsWith("eer"):
      return `${base.slice(0, -1)}y`;
    case verb.endsWith("iar"):
      return `${base}i`;
    case verb.endsWith("uar"):
      return `${base}ú`;
    case verb.endsWith("ir"):
      if (["e", "o"].includes(base[base.length - 1])) {
        const stemChange = {
          e: "i",
          o: "u",
        }[base[base.length - 1]];
        return base.slice(0, -1) + stemChange;
      }
  }

  return base;
};

const applyStemChangeImperfect = (verb: string): string => {
  const verb_lower = verb.toLowerCase();
  if (irregularStemsImperfect[verb_lower]) {
    return irregularStemsImperfect[verb_lower];
  }

  return verb.slice(0, -2);
};

const applyStemChangeFuture = (verb: string): string => {
  const verb_lower = verb.toLowerCase();
  if (irregularStemsFutureConditional[verb_lower]) {
    return irregularStemsFutureConditional[verb_lower];
  }

  return verb;
};

const applyStemChangeConditional = (verb: string): string => {
  // Conditional uses the same stems as future tense
  return applyStemChangeFuture(verb);
};
export const conjugateIndicative = (
  verb: string,
  person: Person,
  tense: Tense
): string | null => {
  let stem: string;
  switch (tense) {
    case "Present":
      stem = applyStemChangePresent(verb);
      break;
    case "Preterite":
      stem = applyStemChangePreterite(verb);
      break;
    case "Imperfect":
      stem = applyStemChangeImperfect(verb);
      break;
    case "Future":
      stem = applyStemChangeFuture(verb);
      break;
    case "Conditional":
      stem = applyStemChangeConditional(verb);
      break;
    default:
      stem = verb.slice(0, -2);
  }

  const ending = verb.slice(-2);

  if (!verbEndings[tense]) return null;
  return stem + verbEndings[tense][ending][person];
};
