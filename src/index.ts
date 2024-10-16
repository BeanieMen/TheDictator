import axios from "axios";
import { load } from "cheerio";
import { Command } from "commander";
import { analyzeConjugation } from "./irregularities";

const program = new Command();

const scrapeTables = async (verb: string) => {
  try {
    const { data } = await axios.get(
      `https://www.spanishdict.com/conjugate/${verb}`
    );
    const $ = load(data);

    const tablesData: string[][][] = [];

    $("table").each((index, table) => {
      const tableData: string[][] = [];

      $(table)
        .find("tr")
        .each((i, row) => {
          const rowData: string[] = [];

          $(row)
            .find("td, th")
            .each((j, cell) => {
              rowData.push($(cell).text().trim());
            });

          if (rowData.length > 0) {
            tableData.push(rowData);
          }
        });

      tablesData.push(tableData);
    });

    return {
      indicative: tablesData[1] || [],
      subjunctive: tablesData[2] || [],
    };
  } catch (error) {
    console.error("Error scraping tables:", error);
    return { indicative: [], subjunctive: [] };
  }
};

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
