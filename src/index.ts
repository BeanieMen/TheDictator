import { Command } from "commander";
import { scrapeTables } from "./scrape";
import { checkIrregularities } from "./irregularities";
import { writeFile, readFile, access } from "node:fs/promises";
import type { ConjugationTable } from "./types";

type VerbsCollection = {
  [x: string]: {
    meanings: string[];
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
const CACHE_FILE = "verbs_conjugations.json";

const initializeCache = async () => {
  try {
    await access(CACHE_FILE);
  } catch {
    await writeFile(CACHE_FILE, JSON.stringify({}, null, 2));
  }
};

const saveToFile = async (data: VerbsCollection) => {
  const fileName = "verbs_conjugations.json";
  try {
    let existingData: VerbsCollection = {};
    try {
      const fileContent = await readFile(fileName, "utf-8");
      existingData = JSON.parse(fileContent) as VerbsCollection;
    } catch (err: unknown) {
      console.log(`Error reading cache layer: ${err}`);
    }
    const updatedData: VerbsCollection = { ...existingData, ...data };
    await writeFile(fileName, JSON.stringify(updatedData, null, 2));
  } catch (err) {
    console.error(`Error saving file: ${err}`);
  }
};

const main = async (verb: string) => {
  await initializeCache();

  try {
    const fileContent = await readFile("verbs_conjugations.json", "utf-8");
    const cache = JSON.parse(fileContent) as VerbsCollection;
    if (cache[verb]) {
      console.log(`${verb}: ${cache[verb].meanings.join(", ")}`);
      console.log("\n");
      console.log("Checking irregularities for the Indicative mood:");
      for (const irrConj of cache[verb].indicativeIrr) {
        console.log(irrConj);
      }
      console.log("\n");
      console.log("Checking irregularities for the Subjunctive mood:");
      for (const irrConj of cache[verb].subjunctiveIrr) {
        console.log(irrConj);
      }
      console.log("\n");
      console.log("Checking irregularities for the Imperative mood:");
      for (const irrConj of cache[verb].imperativeIrr) {
        console.log(irrConj);
      }
      return;
    }
  } catch (err) {
  }

  const verbInfo = await scrapeTables(verb);
  if (!verbInfo) return;

  const verbConj = {
    Indicative: verbInfo.Indicative,
    Imperative: verbInfo.Imperative,
    Subjunctive: verbInfo.Subjunctive,
  };

  console.log(`${verb}: ${verbInfo.meanings.join(", ")}`);
  console.log("\n");
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
      meanings: verbInfo.meanings,
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