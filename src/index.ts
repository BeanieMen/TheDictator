import { Command } from "commander";
import { scrapeTables } from "./scrape";
import { analyzeConjugation } from "./irregularities";

const program = new Command();



const main = async (verb: string) => {
  const verbConj = await scrapeTables(verb);
  if (verbConj.indicative.length > 0) {
    console.log(analyzeConjugation(verb, verbConj.indicative))
  }
};

// Define the CLI command and options
program
  .version("1.0.0")
  .description("CLI tool to scrape Spanish verb conjugations from SpanishDict")
  .argument("<verb>", "Verb to conjugate")
  .action((verb) => {
    main(verb);
  });

program.parse(process.argv);
