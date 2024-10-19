import { conjugateImperative } from "./conjugationImperative";
import { conjugateIndicative } from "./conjugationIndicative";
import { conjugateSubjunctive } from "./conjugationSubjunctive";
import type {
  Person,
  Tense,
  SubjunctiveTense,
  Mood,
  ScrapedTables,
  ImperativePerson,
  ImperativeTense,
} from "./types";

export const checkIrregularities = (
  verb: string,
  conjugationTables: ScrapedTables,
  mood: Mood
): string[] => {
  const conjugationTable = conjugationTables[mood];
  const irregularities: string[] = [];

  const relevantPersons = conjugationTable
    .slice(1)
    .filter((row) => !["nosotros", "vosotros"].includes(row[0] as string));

  if (mood === "Imperative") {
    checkImperativeIrregularities(
      verb,
      conjugationTables,
      relevantPersons,
      irregularities
    );
  } else {
    checkIndSubIrregularities(
      verb,
      conjugationTable,
      relevantPersons,
      mood,
      irregularities
    );
  }

  return irregularities;
};

function checkImperativeIrregularities(
  verb: string,
  conjugationTables: ScrapedTables,
  relevantPersons: (string | number)[][],
  irregularities: string[]
): void {
  const imperativeTable = conjugationTables.Imperative;
  const tenses = imperativeTable[0].slice(1) as ImperativeTense[];

  for (const row of relevantPersons) {
    const person = row[0] as ImperativePerson;

    for (const [index, tense] of tenses.entries()) {
      const actualForm = row[index + 1];
      if (actualForm === "-") continue;

      const predictedForm = conjugateImperative(
        verb,
        conjugationTables.Indicative,
        conjugationTables.Subjunctive,
        person,
        tense
      );

      if (predictedForm && predictedForm !== actualForm) {
        console.log(
          `(${person}) Irregularity found: ${actualForm} vs ${predictedForm} on tense ${tense}`
        );
        irregularities.push(`(${person}) ${actualForm}`);
      }
    }
  }
}

function checkIndSubIrregularities(
  verb: string,
  conjugationTable: (string | number)[][],
  relevantPersons: (string | number)[][],
  mood: Mood,
  irregularities: string[]
) {
  const tenses = conjugationTable[0].slice(1);

  for (const row of relevantPersons) {
    const person = row[0] as Person;

    for (const [index, tense] of tenses.entries()) {
      const actualForm = row[index + 1];
      if (actualForm === "-") continue;

      const predictedForm = getConjugatedForm(
        verb,
        person,
        tense.toString(),
        mood
      );

      if (predictedForm && predictedForm !== actualForm) {
        console.log(
          `(${person}) Irregularity found: ${actualForm} vs ${predictedForm} on tense ${tense}`
        );
        irregularities.push(`(${person}) ${actualForm}`);
      }
    }
  }
}

function getConjugatedForm(
  verb: string,
  person: Person,
  tense: string,
  mood: Mood
): string | null {
  switch (mood) {
    case "Indicative":
      return conjugateIndicative(verb, person, tense as Tense);
    case "Subjunctive":
      return conjugateSubjunctive(verb, person, tense as SubjunctiveTense);
    default:
      return null;
  }
}
