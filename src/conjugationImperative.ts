import type {
  ConjugationTable,
  ImperativePerson,
  ImperativeTense,
} from "./types";

export const conjugateImperative = (
  verb: string,
  indicativeTable: ConjugationTable,
  subjunctiveTable: ConjugationTable,
  person: ImperativePerson,
  Tense: ImperativeTense
): string | null => {
  const personIndex = findPersonRow(person);
  if (personIndex === undefined) return null;
  const affirmativeForm = getAffirmativeForm(
    verb,
    indicativeTable,
    subjunctiveTable,
    person,
  );
  if (Tense === "Affirmative") {
    return affirmativeForm;
  }
    switch (person) {
      case "tú":
        return `no ${subjunctiveTable[2][1]}`;
      case "Ud.":
        return `no ${affirmativeForm}`;
      case "nosotros":
        return `no ${affirmativeForm}`;
      case "vosotros":
        return `no ${subjunctiveTable[5][1]}`;
      case "Uds.":
        return `no ${affirmativeForm}`;
      default:
        return "-";
    }
};

function findPersonRow(person: ImperativePerson): number | undefined {
  const personMap: { [key: string]: string } = {
    tú: "tú",
    "Ud.": "él/ella/Ud.",
    nosotros: "nosotros",
    vosotros: "vosotros",
    "Uds.": "ellos/ellas/Uds.",
  };

  return [1, 2, 3, 4, 5, 6].find((i) => personMap[person]);
}

function getAffirmativeForm(
  verb: string,
  indicativeTable: ConjugationTable,
  subjunctiveTable: ConjugationTable,
  person: ImperativePerson
): string {
  switch (person) {
    case "tú":
      return indicativeTable[3][1];
    case "Ud.":
      return subjunctiveTable[3][1];
    case "nosotros":
      return subjunctiveTable[4][1];
    case "vosotros":
      return `${verb.substring(0, verb.length - 1)}r`;
    case "Uds.":
      return subjunctiveTable[6][1];
    default:
      return "-";
  }
}
