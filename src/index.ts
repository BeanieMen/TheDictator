import { Command } from "commander";
import { scrapeTables } from "./scrape";
import { checkIrregularities } from "./irregularities";

const program = new Command();

const main = async (verb: string) => {
  const verbConj = await scrapeTables(verb);

  if (!verbConj || verbConj.indicative.length === 0) {
    console.log(`"${verb}" is not a valid verb.`);
    return;
  }

  if (verbConj.indicative.length > 0) {
    checkIrregularities(verb, verbConj.indicative);
  }
};

program
  .version("1.0.0")
  .description("CLI tool to scrape Spanish verb conjugations from SpanishDict")
  .argument("<verb>", "Verb to conjugate")
  .action((verb) => {
    main(verb);
  });

program.parse(process.argv);
