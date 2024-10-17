import {
  irregularStemsPresent,
  irregularStemsPreterite,
  irregularStemsImperfect,
  verbEndings,
  irregularStemsFutureConditional,
} from "./constants";
import { Person, Tense } from "./types";

export const applyStemChangePresent = (verb: string): string => {
  const verb_lower = verb.toLowerCase();
  if (irregularStemsPresent[verb_lower]) {
    return irregularStemsPresent[verb_lower];
  }

  const base = verb.slice(0, -2);

  switch (true) {
    case verb.endsWith("ucir"):
      return base.slice(0, -2) + "zc";
    case verb.endsWith("uir"):
      return base + "y";
    case verb.endsWith("eer"):
      return base;
    case verb.endsWith("iar"):
      return base + "í";
    case verb.endsWith("uar"):
      return base + "ú";
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

export const applyStemChangePreterite = (verb: string): string => {
  const verb_lower = verb.toLowerCase();
  if (irregularStemsPreterite[verb_lower]) {
    return irregularStemsPreterite[verb_lower];
  }

  const base = verb.slice(0, -2);

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

export const applyStemChangeImperfect = (verb: string): string => {
  const verb_lower = verb.toLowerCase();
  if (irregularStemsImperfect[verb_lower]) {
    return irregularStemsImperfect[verb_lower];
  }

  return verb.slice(0, -2);
};

export const applyStemChangeFuture = (verb: string): string => {
  const verb_lower = verb.toLowerCase();
  if (irregularStemsFutureConditional[verb_lower]) {
    return irregularStemsFutureConditional[verb_lower];
  }

  return verb;
};

export const applyStemChangeConditional = (verb: string): string => {
  // Conditional uses the same stems as future tense
  return applyStemChangeFuture(verb);
};
export const conjugate = (
  verb: string,
  person: Person,
  tense: Tense
): string | null => {
  let stem;
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
