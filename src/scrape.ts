import axios from "axios";
import { load } from "cheerio";

export const scrapeTables = async (verb: string) => {
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
