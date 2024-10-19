import { Command } from "commander";
import { scrapeTables } from "./scrape";
import { checkIrregularities } from "./irregularities";
import { conjugateIndicative } from "./conjugationIndicative";
import { conjugateSubjunctive } from "./conjugationSubjunctive";
import { conjugateImperative } from "./conjugationImperative";

const program = new Command();

const main = async (verb: string) => {
  const verbConj = await scrapeTables(verb);
  if (!verbConj) return

  console.log("Checking irregularities for the Indicative mood");
  checkIrregularities(verb, verbConj, "Indicative")
  console.log("\n");

  console.log("Checking irregularities for the Subjunctive mood");
  checkIrregularities(verb, verbConj, "Subjunctive")
  console.log("\n");
  
  console.log("Checking irregularities for the Imperative mood");
  checkIrregularities(verb, verbConj, "Imperative")
  console.log("\n");
};

program
  .version("1.0.0")
  .description("CLI tool to scrape Spanish verb conjugations from SpanishDict")
  .argument("<verb>", "Verb to conjugate")
  .action((verb) => {
    main(verb);
  });

program.parse(process.argv);
