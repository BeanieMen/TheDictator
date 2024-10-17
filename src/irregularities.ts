import { Person, Tense, ConjugationTable } from "./types";
import { conjugate } from "./conjugation";

export const checkIrregularities = (
  verb: string,
  conjugationTable: ConjugationTable
): string[] => {
  const irregularities: string[] = [];

  for (let i = 1; i < conjugationTable.length; i++) {
    const row = conjugationTable[i];
    const person = row[0] as Person;
    if (person !== "nosotros" && person != "vosotros") {
      for (let j = 1; j < row.length; j++) {
        const tense = conjugationTable[0][j] as Tense;

        const actual = row[j];
        const predicted = conjugate(verb, person, tense);

        if (predicted && predicted !== actual) {
          console.log(
            `Irregularity found: ${actual} vs ${predicted} on tense ${tense}`
          );
          irregularities.push(`(${person}) ${actual}`);
        }
      }
    }
  }

  return irregularities;
};
