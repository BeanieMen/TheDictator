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
  
  const tenses = conjugationTable[0].slice(1);
  
  let preIndStem = "";
  let pretIndStem = "";
  if (mood === "Subjunctive") {
    preIndStem = conjugationTables.Indicative[1][1].slice(0, -1);
    pretIndStem = conjugationTables.Indicative[3][2].slice(0, -1);
  }

  for (const row of relevantPersons) {
    const person = row[0] as Person & ImperativePerson;
    
    for (const [index, tense] of tenses.entries()) {
      const actualForm = row[index + 1];
      
      if (actualForm === "-") continue;
      
      let predictedForm: string | null = null;
      
      switch (mood) {
        case "Imperative":
          predictedForm = conjugateImperative(
            verb,
            conjugationTables.Indicative,
            conjugationTables.Subjunctive,
            person as ImperativePerson,
            tense as ImperativeTense
          );
          break;
          
        case "Indicative":
          predictedForm = conjugateIndicative(
            verb,
            person as Person,
            tense as Tense
          );
          break;
          
        case "Subjunctive":
          predictedForm = conjugateSubjunctive(
            verb,
            person as Person,
            tense as SubjunctiveTense,
            preIndStem,
            pretIndStem
          );
          break;
      }
      
      if (predictedForm && predictedForm !== actualForm) {
        const irregularityMessage = 
          `(${person}) Irregularity found: ${actualForm} vs ${predictedForm} on tense ${tense}`;
        console.log(irregularityMessage);
        irregularities.push(irregularityMessage);
      }
    }
  }
  
  return irregularities;
};