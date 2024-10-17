import {
  irregularStemsPresent,
  irregularStemsPreterite,
  irregularStemsImperfect,
  verbEndings,
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

export const conjugate = (
  verb: string,
  person: Person,
  tense: Tense
): string | null => {
  let stem;
  if (tense === "Present") {
    stem = applyStemChangePresent(verb);
  } else if (tense === "Preterite") {
    stem = applyStemChangePreterite(verb);
  } else if (tense === "Imperfect") {
    stem = applyStemChangeImperfect(verb);
  } else {
    stem = verb.slice(0, -2);
  }

  const ending = verb.slice(-2);

  if (!verbEndings[tense]) return null;
  return stem + verbEndings[tense][ending][person];
};
