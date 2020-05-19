/**
 * @fileoverview this is a file which allows the population of the excel spreadsheet through individual objects.
 * @package
 * @class populateHouse()
 * @class populateLinkedIn()
 * @class populateFinance()
 * @class populateTrends()
 */
import { getHouseData, getFinanceData, getTrendsData } from "./api";
import { loadConfig } from "./config";

export async function populateHouse() {
  let House = {
    //Stores excel index for data
    name: ["B1", "H1", "K1", "N1", "Q1", "T1", "W1"],
    summary: ["C3:C11", "I3:I11", "L3:L11", "O3:O11", "R3:R11", "U3:U11", "X3:X11"],
    NZBN: ["C14:C21", "I14:I21", "L14:L21", "O14:O21", "R14:R21", "U14:U21", "X14:X21"],
    directors: ["B24:B33", "H24:H33", "K24:K33", "N24:N33", "Q24:Q33", "T24:T33", "W24:W33"],
    share: ["B36:B", "H36:H", "K36:K", "N36:N", "Q36:Q", "T36:T", "W36:W"],

    item: 0,

    store: function(dump: any[]) {
      /**
       *
       * @param {array} dump - A data dump in the form of a 3d array
       * dump = [
       *         [[Name]]
       *         [[summary]],
       *         [[NZBN]],
       *         [[directors]],
       *         [[shares]]
       *        ]
       *
       * @example
       * House.store([ [["Company"]]
       *               [["12345"], ["54321"], ["2025"], ["Active"], ["manufacturing"], ["yes"], ["11235813"]]
       *               [["gst"], ["www.website.com"], ["911"], ["gmail"], ["name"], ["mars"], ["class"], ["ABN"]]
       *               [["Bob"], ["Jenny"], ["Fred"]]
       *               [["Bob"],["10000"], ["Jenny"], ["5000"]]
       *            ]);
       */
      let name = this.name[this.item];
      let summary = this.summary[this.item];
      let NZBN = this.NZBN[this.item];
      let directors = this.directors[this.item] + String(dump[3].length + 23);
      let share = this.share[this.item] + String(dump[4].length + 35);
      this.item++;

      //add into cells
      Excel.run(function(context) {
        var sheet = context.workbook.worksheets.getItem("House");
        sheet.getRange(name).values = dump[0];
        sheet.getRange(summary).values = dump[1];
        sheet.getRange(NZBN).values = dump[2];
        sheet.getRange(directors).values = dump[3];
        sheet.getRange(share).values = dump[4];
        return context.sync().then(function() {
          console.log("Imported House");
        });
      });
    }
  };
  let config = (await loadConfig()).house;
  config.forEach(async item => {
    const data = await getHouseData(item.companyNumber);

    //#region [rgba(70,20,20,0.5)] sample code region
    const summary = [
      [data.INFO.SUMMARY.company_number],
      [data.INFO.SUMMARY.nzbn],
      [data.INFO.SUMMARY.incorporation_date],
      [data.INFO.SUMMARY.company_status],
      [data.INFO.SUMMARY.entity_type],
      [data.INFO.SUMMARY.constitution_filed],
      [data.INFO.SUMMARY.ar_filing_month],
      [data.INFO.SUMMARY.date_retrieved],
      [data.INFO.SUMMARY.url]
    ];
    const name = data.NAME;
    const NZBN_sample = [
      ["TODO"],
      ["TODO"],
      ["TODO"],
      ["TODO"],
      ["TODO"],
      ["TODO"],
      [data.INFO.NZBN.industry],
      ["TODO"]
    ];
    let directors = [];
    data.INFO.DIRECTORS.forEach(director => {
      directors.push([director.full_legal_name]);
    });
    let shares = [];
    let sharesKnown = 0;
    data.INFO.SHAREHOLDINGS.allocation.forEach(shareholder => {
      shares.push([
        shareholder[1][0][0].toString(),
        Number(shareholder[0]) / Number(data.INFO.SHAREHOLDINGS.total_number_of_shares)
      ]);
      sharesKnown = sharesKnown + Number(shareholder[0]);
    });
    shares.push([
      "Unknown",
      (Number(data.INFO.SHAREHOLDINGS.total_number_of_shares) - sharesKnown) /
        Number(data.INFO.SHAREHOLDINGS.total_number_of_shares)
    ]);

    const sample = [name, summary, NZBN_sample, directors, shares];
    //stores companies house data
    House.store(sample);
    //#endregion
  });
}

export function populateLinkedIn() {
  let Linkedin = {
    //Stores excel index for data
    company: [
      ["B1", "C3:C7", "B13"],
      ["E1", "F3:F7", "E13"],
      ["H1", "I3:C7", "H13"],
      ["K1", "L3:F7", "K13"],
      ["N1", "O3:O7", "N13"],
      ["Q1", "R3:R7", "Q13"],
      ["T1", "U3:U7", "T13"],
      ["W1", "X3:X7", "W13"],
      ["Z1", "AA3:AA7", "Z13"],
      ["AC1", "AD3:AD7", "AC13"],

      ["B34", "C36:C40", "B46"],
      ["E34", "F36:F40", "E46"],
      ["H34", "I36:C40", "H46"],
      ["K34", "L36:F40", "K46"],
      ["N34", "O36:O40", "N46"],
      ["Q34", "R36:R40", "Q46"],
      ["T34", "U36:U40", "T46"],
      ["W34", "X36:X40", "W46"],
      ["Z34", "AA63:AA40", "Z46"],
      ["AC34", "AD63:AD40", "AC46"],

      ["B67", "C69:C73", "B79"],
      ["E67", "F69:F73", "E79"],
      ["H67", "I69:C73", "H79"],
      ["K67", "L69:F73", "K79"],
      ["N67", "O69:O73", "N79"],
      ["Q67", "R69:R73", "Q79"],
      ["T67", "U69:U73", "T79"],
      ["W67", "X69:X73", "W79"],
      ["Z67", "AA69:AA73", "Z479"],
      ["AC67", "AD69:AD73", "AC79"]
    ],
    item: 0,

    store: function(dump: any[]) {
      /**
       *
       * @param {array} dump - A data dump in the form of a 3d array
       * dump = [
       *         Name,
       *         [summary],
       *         about
       *        ]
       *
       * @example
       * Linkedin.store([
       *                   "9Spokes",
       *                   [["Tech"], ["small"], ["162 bc"], ["Mars"], ["linkedin.com/whatever"]]
       *                   "about info"
       *               ]);
       */
      let name;
      let summary;
      let description;
      name = this.company[this.item][0];
      summary = this.company[this.item][1];
      description = this.company[this.item][2];
      this.item++;
      //add into cells
      Excel.run(function(context) {
        var sheet = context.workbook.worksheets.getItem("Linkedin");
        sheet.getRange(name).values = dump[0];
        sheet.getRange(summary).values = dump[1];
        sheet.getRange(description).values = dump[2];
        return context.sync().then(function() {
          console.log("Imported LinkedIn");
        });
      });
    }
  };

  //#region [rgba(20,20,50,0.5)] sample driver code
  let name = "Alan";
  let summary = [["lecturer"], ["Auckland"], ["www.auckland.ac.nz"], ["lots"], ["linkedin.com/whatever"]];
  let about = "about info";
  let sample = [name, summary, about];
  //stores LinkedIn data
  Linkedin.store(sample);
  //#endregion
}

export async function populateFinance() {
  let Finance = {
    //Stores excel index for data
    summary: [
      ["B1", "C3:D8"],
      ["F1", "G3:H8"],
      ["J1", "K3:L8"],
      ["N1", "O3:P8"],
      ["R1", "S3:T8"]
    ],
    stocks: ["B13:C", "F13:G", "J13:K", "N13:O", "R13:S"],
    item: 0,

    store: function(dump: any[]) {
      /**
       *
       * @param {array} dump - A data dump in the form of a 3d array
       * dump = [
       *         Name,
       *         [summary],
       *         [stocks]
       *        ]
       *
       * @example
       * Linkedin.store([
       *                   "Company",
       *                   [["100B", "+20%"],
       *                    ["200M", "+20%"],
       *                    ["5%", "+20%"],
       *                    ["50", "+20%"],
       *                    ["300B", "+20%"],
       *                    ["10", "+20%"]
       *                   ]
       *                   [["10/10/20", 1],
       *                    ["11/10/20", 1],
       *                    ["12/10/20", 2],
       *                    ["13/10/20", 3]
       *                   ]
       *               ]);
       */
      let name = this.summary[this.item][0];
      let summary = this.summary[this.item][1];
      let stocks = this.stocks[this.item] + String(dump[2].length + 12);
      this.item++;

      //add into cells
      Excel.run(function(context) {
        var sheet = context.workbook.worksheets.getItem("Finance");
        sheet.getRange(name).values = dump[0];
        sheet.getRange(summary).values = dump[1];
        sheet.getRange(stocks).values = dump[2];
        return context.sync().then(function() {
          console.log("Imported Finance");
        });
      });
    }
  };
  let config = (await loadConfig()).finance;
  config.forEach(async item => {
    const data = (await getFinanceData(item.ticker, item.interval, item.range)).chart.result[0];

    //#region [rgba(20,50,20,0.5)] sample driver code
    let name = data.meta.symbol;
    let summary = [
      ["100B", "+TODO%"],
      ["200M", "+TODO%"],
      ["5%", "+TODO%"],
      ["50", "+TODO%"],
      ["300B", "+TODO%"],
      ["10", "+TODO%"]
    ];
    let stocks_sample = [];
    data.timestamp.forEach((day, index) => {
      const date = new Date(day * 1000);
      stocks_sample.push([
        `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
        data.indicators.adjclose[0].adjclose[index]
      ]);
    });

    let sample = [name, summary, stocks_sample];
    //stores finance data
    Finance.store(sample);
    //#endregion
  });
}

export async function populateTrends() {
  let Trends = {
    //Stores excel index for data
    summary: ["C2:C7", "D2:D7", "E2:E7", "F2:F7", "G2:G7"],
    data: ["C13:C", "D13:D", "F13:F", "F13:F", "G13:G"],
    date: "B13:B",
    item: 0,

    store: function(dump: any[]) {
      /**
       *
       * @param {array} dump - A data dump in the form of a 3d array
       * dump = [
       *         [summary],
       *         [data]
       *         date or none
       *        ]
       *
       * @example
       * Trends.store([
       *                   [["1"], ["2"], ["3"], ["4"], ["5"]]
       *                   [[100], [90], [2], [3], [12], [30]]
       *                   0
       *               ]);
       */
      let summary = this.summary[0];
      let data = this.data[this.item] + String(dump[1].length + 12);
      let date;
      if (dump[2] != 0) {
        date = this.date + String(dump[2].length + 12);
      }
      this.item++;
      //add into cells
      Excel.run(function(context) {
        var sheet = context.workbook.worksheets.getItem("Trends");
        sheet.getRange(summary).values = dump[0];
        sheet.getRange(data).values = dump[1];
        if (dump[2] != 0) {
          sheet.getRange(date).values = dump[2];
        }
        return context.sync().then(function() {
          console.log("Imported Trends");
        });
      });
    }
  };
  let config = (await loadConfig()).trends;
  config.forEach(async item => {
    const data = await getTrendsData(item.keyword, item.weeks);
    console.log(data);

    //#region [rgba(10,50,50,0.5)] sample driver code
    let summary = [[item.keyword], ["TODO"], ["TODO"], ["TODO"], ["TODO"], ["TODO"]];
    let trends = [];
    let dates = [];
    data.series.forEach(item => {
      trends.push([item[1]]);
      dates.push([item[0]]);
    });
    let sample = [summary, trends, dates];
    //stores Google Trends data
    Trends.store(sample);
    //#endregion
  });
}
