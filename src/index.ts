import { Command } from "commander";
import { scrapeTables } from "./scrape";
import { checkIrregularities } from "./irregularities";
import { writeFile, readFile } from "fs/promises";
import { ConjugationTable } from "./types";

// Define a single type for the entire structure
type VerbsCollection = {
  [x: string]: {
    conjugations: {
      Indicative: ConjugationTable;
      Subjunctive: ConjugationTable;
      Imperative: ConjugationTable;
    };
    indicativeIrr: string[];
    subjunctiveIrr: string[];
    imperativeIrr: string[];
  };
};

const program = new Command();

const saveToFile = async (data: VerbsCollection) => {
  const fileName = "verbs_conjugations.json";

  try {
    let existingData: VerbsCollection = {};
    try {
      const fileContent = await readFile(fileName, "utf-8");
      existingData = JSON.parse(fileContent) as VerbsCollection;
    } catch (err: any) {
      if (err.code !== "ENOENT") throw err;
    }
    const updatedData: VerbsCollection = { ...existingData, ...data };
    await writeFile(fileName, JSON.stringify(updatedData, null, 2));
    console.log(`Data successfully saved to ${fileName}`);
  } catch (err) {
    console.error(`Error saving file: ${err}`);
  }
};

const main = async (verb: string) => {
  const verbConj = await scrapeTables(verb);
  if (!verbConj) return;

  console.log("Checking irregularities for the Indicative mood");
  const indicativeIrr = checkIrregularities(verb, verbConj, "Indicative");
  console.log("\n");

  console.log("Checking irregularities for the Subjunctive mood");
  const subjunctiveIrr = checkIrregularities(verb, verbConj, "Subjunctive");
  console.log("\n");

  console.log("Checking irregularities for the Imperative mood");
  const imperativeIrr = checkIrregularities(verb, verbConj, "Imperative");
  console.log("\n");

  const result: VerbsCollection = {
    [verb]: {
      conjugations: verbConj,
      indicativeIrr: indicativeIrr,
      subjunctiveIrr: subjunctiveIrr,
      imperativeIrr: imperativeIrr,
    },
  };

  await saveToFile(result);
};

program
  .version("1.0.0")
  .description("CLI tool to scrape Spanish verb conjugations from SpanishDict")
  .argument("<verb>", "Verb to conjugate")
  .action((verb) => {
    main(verb);
  });

program.parse(process.argv);
