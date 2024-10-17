export type Person =
  | "yo"
  | "tú"
  | "él/ella/Ud."
  | "nosotros"
  | "vosotros"
  | "ellos/ellas/Uds.";

export type Tense = "Present" | "Preterite" | "Imperfect" | "Conditional" | "Future";
export type ConjugationTable = string[][];
