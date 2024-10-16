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

const applyStemChange = (
  verb: string,
  person: Person,
  tense: Tense
): string => {
  const stemChanges: { [key: string]: { [key: string]: string } } = {
    Present: { e: "ie", o: "ue", i: "ie" },
  };

  const stem = verb.slice(0, -2);
  const lastVowel = [...stem]
    .reverse()
    .find((char) => /[aeiouáéíóúAEIOUÁÉÍÓÚ]/.test(char))!;

  if (
    vowels.includes(stem[0]) &&
    stem.split("").filter((char) => vowels.includes(char)).length === 1
  )
    return stem;

  const shouldStemChange =
    tense === "Present" && person !== "nosotros" && person !== "vosotros";

  if (shouldStemChange && stemChanges[tense]) {
    const changes = stemChanges[tense];
    const regex = new RegExp(`${lastVowel}([^aeiou]*)`);
    if (stem.match(regex)) {
      return stem.replace(regex, `${changes[lastVowel]}$1`);
    }
  }

  return stem;
};

const conjugate = (
  verb: string,
  person: Person,
  tense: Tense
): string | null => {
  const stem = applyStemChange(verb, person, tense);
  const ending = verb.slice(-2);

  if (tense === "Present") {
    const endings: { [key: string]: { [key in Person]: string } } = {
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
    };

    return stem + endings[ending][person];
  }

  return null;
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

      // Check for irregularities
      if (predicted && predicted !== actual) {
        console.log(actual, predicted);
        irregularities.push(`(${person}) ${actual}`); 
      }
    }
  }

  return irregularities;
};
