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

    return {
      indicative: tablesData[1] || [],
      subjunctive: tablesData[2] || [],
    };
  } catch (error) {
    return null;
  }
};
