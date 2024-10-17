type Person =
  | "yo"
  | "tú"
  | "él/ella/Ud."
  | "nosotros"
  | "vosotros"
  | "ellos/ellas/Uds.";

type Tense = "Present" | "Preterite" | "Imperfect" | "Conditional" | "Future";
type ConjugationTable = string[][];

const vowels = ["a", "e", "i", "o", "u"];

const applyStemChangePresent = (verb: string, person: Person): string => {
  const stemChanges: { [key: string]: string } = {
    e: "ie",
    o: "ue",
    i: "ie",
    u: "ue",
  };

  const stem = verb.slice(0, -2);
  const lastVowel = [...stem]
    .reverse()
    .find((char) => vowels.includes(char.toLowerCase()))!;

  if (
    vowels.includes(stem[0].toLowerCase()) &&
    stem.split("").filter((char) => vowels.includes(char.toLowerCase())).length === 1
  )
    return stem;

  const shouldStemChange = person !== "nosotros" && person !== "vosotros";

  if (shouldStemChange && stemChanges[lastVowel]) {
    const regex = new RegExp(`${lastVowel}([^aeiou]*)`);
    if (stem.match(regex)) {
      return stem.replace(regex, `${stemChanges[lastVowel]}$1`);
    }
  }

  return stem;
};

const applyStemChangePreterite = (verb: string, person: Person): string => {
  const irregularStems: { [key: string]: string } = {
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
    preferir: "prefir"
  };

  const verb_lower = verb.toLowerCase();
  if (irregularStems[verb_lower]) {
    return irregularStems[verb_lower];
  }

  const ending = verb.slice(-2);
  const base = verb.slice(0, -2);
  const shouldStemChange = person !== "nosotros" && person !== "vosotros";

  if (shouldStemChange) {
    switch (true) {
      case verb.endsWith("ucir"):
        return base.slice(0, -2) + "j";
      case verb.endsWith("uir"):
        return base + "y";
      case verb.endsWith("eer"):
        return base.slice(0, -1) + "y";
      case verb.endsWith("iar"):
        return base + "i";
      case verb.endsWith("uar"):
        return base + "ú";
      case ending === "ir":
        if (["e", "o"].includes(base[base.length - 1])) {
          const stemChange = {
            e: "i",
            o: "u",
          }[base[base.length - 1]];
          return base.slice(0, -1) + stemChange;
        }
    }
  }

  return base;
};

const conjugate = (
  verb: string,
  person: Person,
  tense: Tense
): string | null => {
  let stem;
  if (tense === "Present") {
    stem = applyStemChangePresent(verb, person);
  } else if (tense === "Preterite") {
    stem = applyStemChangePreterite(verb, person);
  } else {
    stem = verb.slice(0, -2);
  }

  const ending = verb.slice(-2);

  const endings: {
    [key in Tense]?: {
      [key: string]: { [key in Person]: string }
    }
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
  };

  if (!endings[tense]) return null;
  return stem + endings[tense][ending][person];
};

export const analyzeConjugation = (
  verb: string,
  conjugationTable: ConjugationTable
): string[] => {
  const irregularities: string[] = [];

  for (let i = 1; i < conjugationTable.length; i++) {
    const row = conjugationTable[i];
    const person = row[0] as Person;
    for (let j = 1; j < row.length; j++) {
      const tense = conjugationTable[0][j] as Tense;
      const actual = row[j];
      const predicted = conjugate(verb, person, tense);

      if (predicted && predicted !== actual) {
        console.log(`Irregularity found: ${actual} vs ${predicted}`);
        irregularities.push(`(${person}) ${actual}`);
      }
    }
  }

  return irregularities;
};