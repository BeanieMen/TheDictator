import axios from "axios";
import { load } from "cheerio";

export const scrapeTables = async (verb: string) => {
  try {
    const { data } = await axios.get(
      `https://www.spanishdict.com/conjugate/${verb}`
    );
    const $ = load(data);

    // some page searching magic to check if that shitty site is returning some other verb's conj
    const headwordH1 = $("#headword-es h1");
    if (!headwordH1.length || headwordH1.text().trim() !== verb) {
      throw new Error(`Invalid verb: "${verb}" does not exist.`);
    }

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

    if (tablesData[2]) {
      const SubjunctiveHeader = [
        "",
        "Present",
        "ImperfectRA",
        "ImperfectSE",
        "Future",
      ];
      const transformedRows = tablesData[2].slice(1).map((row) => {
        const [pronoun, presentValue, imperfectValue, futureValue] = row;
        const [imperfectRA, imperfectSE] = imperfectValue
          .split(",")
          .map((s) => s.trim());
        return [pronoun, presentValue, imperfectRA, imperfectSE, futureValue];
      });
      tablesData[2] = [SubjunctiveHeader, ...transformedRows];
    }

    const meanings: string[] = [];
    $("div[id^='quickdef']").each((index, element) => {
      const meaning = $(element).find("a").text().trim();
      if (meaning) meanings.push(meaning);
    });

    return {
      meanings: meanings,
      Indicative: tablesData[1] || [],
      Subjunctive: tablesData[2] || [],
      Imperative: tablesData[3] || [],
    };
  } catch (error) {
    return null;
  }
};
