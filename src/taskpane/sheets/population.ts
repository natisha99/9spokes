/**
 * @fileoverview this is a file which allows the population of the excel spreadsheet through individual objects.
 * @package
 * @class populateHouse()
 * @class populateLinkedIn()
 * @class populateFinance()
 * @class populateTrends()
 */
import { getHouseNZData, getFinanceData, getTrendsData, getHouseUKData, getLinkedinData } from "./api";
import { loadConfig } from "./config";

export async function populateHouse() {
  let House = {
    //Stores excel index for data
    name: ["B1", "E1", "H1", "K1", "N1", "Q1", "T1", "W1"],
    name_merged: ["B1:C1", "E1:F1", "H1:I1", "K1:L1", "N1:O1", "Q1:R1", "T1:U1", "W1:X1"],
    summary: ["C3:C11", "F3:F11", "I3:I11", "L3:L11", "O3:O11", "R3:R11", "U3:U11", "X3:X11"],
    NZBN: ["C14:C21", "F14:F21", "I14:I21", "L14:L21", "O14:O21", "R14:R21", "U14:U21", "X14:X21"],
    directors: ["B24:B", "E24:E", "H24:H", "K24:K", "N24:N", "Q24:Q", "T24:T", "W24:W"],
    directors_merged: ["B24:C33", "E24:F33", "H24:I33", "K24:L33", "N24:O33", "Q24:R33", "T24:U33", "W24:X33"],
    share: ["B36:C", "E36:F", "H36:I", "K36:L", "N36:O", "Q36:R", "T36:U", "W36:X"],

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
        var sheet = context.workbook.worksheets.getItem("House_NZ");
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

  // Clear old data
  Excel.run(function(context) {
    var sheet = context.workbook.worksheets.getItem("House_NZ");
    sheet.getRanges(House.name_merged.toString()).clear("Contents");
    sheet.getRanges(House.summary.toString()).clear("Contents");
    sheet.getRanges(House.NZBN.toString()).clear("Contents");
    sheet.getRanges(House.directors_merged.toString()).clear("Contents");
    sheet.getRanges(House.share.reduce((prev, cur) => [...prev, cur + "10000"], []).toString()).clear("Contents");
    return context.sync().then(function() {
      console.log("House_NZ Cleared");
    });
  });

  let config = (await loadConfig()).house;

  // Populate new data
  for (const item of config) {
    const data = await getHouseNZData(item.companyNumber);

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
      [data.INFO.NZBN.gst_number],
      [data.INFO.NZBN.website],
      [data.INFO.NZBN.phone_number],
      [data.INFO.NZBN.email_address],
      [data.INFO.NZBN.trading_name],
      [data.INFO.NZBN.trading_area],
      [data.INFO.NZBN.industry],
      [data.INFO.NZBN.abn]
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
  }
}

export async function populateUK() {
  let House = {
    //Stores excel index for data
    summary: [
      ["B1", "C3:C7", "C10:C11"],
      ["E1", "F3:F7", "F10:F11"],
      ["H1", "I3:I7", "I10:I11"],
      ["K1", "L3:L7", "L10:L11"],
      ["N1", "O3:O7", "O10:O11"],
      ["Q1", "R3:R7", "R10:R11"],
      ["T1", "U3:U7", "U10:U11"],
      ["W1", "X3:X7", "X10:X11"]
    ],
    directors: ["B24:B", "E24:E", "H24:H", "K24:K", "N24:N", "Q24:Q", "T24:T", "W24:W"],
    share: ["B36:C", "E36:F", "H36:I", "K36:L", "N36:O", "Q36:R", "T36:U", "W36:X"],

    item: 0,

    store: function(dump: any[]) {
      /**
       *
       * @param {array} dump - A data dump in the form of a 3d array
       * dump = [
       *         [[summary]],
       *         [[directors]],
       *         [[shares]]
       *        ]
       *
       * @example
       * House.store([ [[["Company"]],
       *               ["12345"], ["London"], ["2025"], ["2025"], ["www.asdsad.com"]],
       *               [["2012"], [True]]]
       *               [["Bob"], ["Jenny"], ["Fred"]]
       *               [["Bob"],["10000"], ["Jenny"], ["5000"]]
       *            ]);
       */
      let summary = this.summary[this.item];
      let directors = this.directors[this.item] + String(dump[3].length + 23);
      let share = this.share[this.item] + String(dump[4].length + 35);
      this.item++;

      //add into cells
      Excel.run(function(context) {
        var sheet = context.workbook.worksheets.getItem("House_UK");
        sheet.getRange(summary[0]).values = dump[0][0];
        sheet.getRange(summary[1]).values = dump[0][1];
        sheet.getRange(summary[2]).values = dump[0][2];
        sheet.getRange(directors).values = dump[2];
        sheet.getRange(share).values = dump[3];
        return context.sync().then(function() {
          console.log("Imported House UK");
        });
      });
    }
  };
  let config = (await loadConfig()).house;
  for (const item of config) {
    /*
    LINK TO COMPANIES HOUSE UK

    */
    const data = await getHouseUKData(item.companyNumber);

    //#region [rgba(70,20,20,0.5)] sample code region
    const summary = [
      [data.NAME],
      [
        [data.INFO.SUMMARY.company_number],
        [data.INFO.SUMMARY.company_status],
        [data.INFO.SUMMARY.entity_type],
        [data.INFO.SUMMARY.constitution_filed],
        [data.INFO.SUMMARY.ar_filing_month]
      ],
      [[data.DATE], [data.DATE]]
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

    const sample = [summary, directors, shares];
    //stores companies house data
    House.store(sample);
    //#endregion
  }
}

export async function populateLinkedIn() {
  let Linkedin = {
    //Stores excel index for data
    company: [
      ["B1", "C3:C8", "B14"],
      ["E1", "F3:F8", "E14"],
      ["H1", "I3:I8", "H14"],
      ["K1", "L3:F8", "K14"],
      ["N1", "O3:O8", "N14"],

      ["B36", "C38:C43", "B49"],
      ["E36", "F38:F43", "E49"],
      ["H36", "I38:I43", "H49"],
      ["K36", "L38:F43", "K49"],
      ["N36", "O38:O43", "N49"],

      ["B70", "C72:C77", "B83"],
      ["E70", "F72:F77", "E83"],
      ["H70", "I72:I77", "H83"],
      ["K70", "L72:F77", "K83"],
      ["N70", "O72:O77", "N83"]
    ],
    company_merged: [
      ["B1:C1", "C3:C11", "B14:C33"],
      ["E1:F1", "F3:F11", "E14:F33"],
      ["H1:I1", "I3:I11", "H14:I33"],
      ["K1:L1", "L3:F11", "K14:L33"],
      ["N1:O1", "O3:O11", "N14:O33"],

      ["B36:C36", "C38:C46", "B49:C68"],
      ["E36:F36", "F38:F46", "E49:F68"],
      ["H36:I36", "I38:C46", "H49:I68"],
      ["K36:L36", "L38:F46", "K49:L68"],
      ["N36:O36", "O38:O46", "N49:O68"],

      ["B70:C70", "C72:C80", "B83:C102"],
      ["E70:F70", "F72:F80", "E83:F102"],
      ["H70:I70", "I72:C80", "H83:I102"],
      ["K70:L70", "L72:F80", "K83:L102"],
      ["N70:O70", "O72:O80", "N83:O102"]
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

  // Clear old data
  Excel.run(function(context) {
    var sheet = context.workbook.worksheets.getItem("Linkedin");
    sheet.getRanges(Linkedin.company_merged.toString()).clear("Contents");
    return context.sync().then(function() {
      console.log("Linkedin Cleared");
    });
  });

  let config = (await loadConfig()).linkedin;

  // Populate new data
  for (const item of config) {
    const data = await getLinkedinData(item.profileName);
    //#region [rgba(20,50,20,0.5)] sample driver code
    let sample = [
      item.profileName.replace(/-/g, " "),
      [[data.type], [data.industry], [data.company_size], [data.specialities], [data.website], [data.url]],
      data.overview
    ];
    Linkedin.store(sample);
    //#endregion
  }
}

export async function populateFinance() {
  let Finance = {
    //Stores excel index for data
    name: ["B1", "F1", "J1", "N1", "R1"],
    name_merged: ["B1:D1", "F1:H1", "J1:L1", "N1:P1", "R1:T1"],
    stocks: ["B5:C", "F5:G", "J5:K", "N5:O", "R5:S"],
    item: 0,

    store: function(dump: any[]) {
      /**
       *
       * @param {array} dump - A data dump in the form of a 3d array
       * dump = [
       *         Name,
       *         [stocks]
       *        ]
       *
       * @example
       * Linkedin.store([
       *                   "Company",
       *                   [["10/10/20", 1],
       *                    ["11/10/20", 1],
       *                    ["12/10/20", 2],
       *                    ["13/10/20", 3]
       *                   ]
       *               ]);
       */
      let name = this.name[this.item];
      let stocks = this.stocks[this.item] + String(dump[1].length + 4);
      this.item++;

      //add into cells
      Excel.run(function(context) {
        var sheet = context.workbook.worksheets.getItem("Finance");
        sheet.getRange(name).values = dump[0];
        sheet.getRange(stocks).values = dump[1];
        return context.sync().then(function() {
          console.log("Imported Finance");
        });
      });
    }
  };

  // Clear old data
  Excel.run(function(context) {
    var sheet = context.workbook.worksheets.getItem("Finance");
    sheet.getRanges(Finance.name_merged.toString()).clear("Contents");
    sheet.getRanges(Finance.stocks.reduce((prev, cur) => [...prev, cur + "242"], []).toString()).clear("Contents");
    return context.sync().then(function() {
      console.log("Finance Cleared");
    });
  });

  let config = (await loadConfig()).finance;

  // Populate new data
  for (const item of config) {
    const data = (await getFinanceData(item.ticker, item.interval, item.range)).chart.result[0];

    //#region [rgba(20,50,20,0.5)] sample driver code
    let name = data.meta.symbol;
    let stocks_sample = [];
    data.timestamp.forEach((day, index) => {
      const date = new Date(day * 1000);
      stocks_sample.push([
        `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
        data.indicators.adjclose[0].adjclose[index]
      ]);
    });

    let sample = [name, stocks_sample];
    //stores finance data
    Finance.store(sample);
    //#endregion
  }
}

export async function populateTrends() {
  let Trends = {
    //Stores excel index for data
    summary: ["C2:C7", "D2:D7", "E2:E7", "F2:F7", "G2:G7"],
    data: ["C13:C", "D13:D", "E13:E", "F13:F", "G13:G"],
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
      let summary = this.summary[this.item];
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

  // Clear old data
  Excel.run(function(context) {
    var sheet = context.workbook.worksheets.getItem("Trends");
    sheet.getRanges(Trends.summary.toString()).clear("Contents");
    sheet.getRanges(Trends.data.reduce((prev, cur) => [...prev, cur + "64"], []).toString()).clear("Contents");
    sheet.getRanges(Trends.date + "64").clear("Contents");
    return context.sync().then(function() {
      console.log("Trends Cleared");
    });
  });

  let config = (await loadConfig()).trends;

  // Populate new data
  for (const item of config) {
    const data = await getTrendsData(item.keyword, item.weeks);

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
  }
}
