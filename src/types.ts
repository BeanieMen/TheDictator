export type Person =
  | "yo"
  | "tú"
  | "él/ella/Ud."
  | "nosotros"
  | "vosotros"
  | "ellos/ellas/Uds.";
export type ImperativePerson =
  | "yo"
  | "tú"
  | "Ud."
  | "nosotros"
  | "vosotros"
  | "Uds.";
export type Mood = "Imperative" | "Indicative" | "Subjunctive";
export type Tense =
  | "Present"
  | "Preterite"
  | "Imperfect"
  | "Conditional"
  | "Future";
export type SubjunctiveTense =
  | "Present"
  | "ImperfectRA"
  | "ImperfectSE"
  | "Future";
export type ConjugationTable = string[][];
export type ScrapedTables = {
  Indicative: ConjugationTable;
  Subjunctive: ConjugationTable;
  Imperative: ConjugationTable;
}
export type ImperativeTense = "Affirmative" | "Negative";
