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
      conjugationTables,
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
  relevantPersons: string[][],
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
  conjugationTables: ScrapedTables,
  relevantPersons: string[][],
  mood: Mood,
  irregularities: string[]
) {
  const tenses = conjugationTables[mood][0].slice(1);
  let preIndStem = conjugationTables.Indicative[1][1];
  let pretIndStem = conjugationTables.Indicative[3][2];
  preIndStem = preIndStem.substring(0, preIndStem.length - 1);
  pretIndStem = pretIndStem.substring(0, pretIndStem.length - 1);
  for (const row of relevantPersons) {
    const person = row[0] as Person;

    for (const [index, tense] of tenses.entries()) {
      const actualForm = row[index + 1];
      if (actualForm === "-") continue;
      let predictedForm: string | null;

      if (mood === "Indicative")
        predictedForm = conjugateIndicative(verb, person, tense as Tense);
      else {
        predictedForm = conjugateSubjunctive(
          verb,
          person,
          tense as SubjunctiveTense,
          preIndStem,
          pretIndStem
        );
      }
      if (predictedForm && predictedForm !== actualForm) {
        console.log(
          `(${person}) Irregularity found: ${actualForm} vs ${predictedForm} on tense ${tense}`
        );
        irregularities.push(`(${person}) ${actualForm}`);
      }
    }
  }
}
