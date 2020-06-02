/**
 * @fileoverview this is a file which allows the population of the excel spreadsheet through individual objects.
 * @package
 * @class populateHouse()
 * @class populateLinkedIn()
 * @class populateFinance()
 * @class populateTrends()
 */
import { getHouseDataNZ, getFinanceData, getTrendsData, getLinkedinData, getHouseDataUK } from "./api";
import { loadConfig } from "./config";

export async function populateHouseNZ() {
  let House = {
    //Stores excel index for data
    item: 0,
    name: ["B2", "E2", "H2", "K2", "N2", "Q2", "T2", "W2"],
    name_merged: ["B2:C2", "E2:F2", "H2:I2", "K2:L2", "N2:O2", "Q2:R2", "T2:U2", "W2:X2"],
    summary: ["C4:C12", "F4:F12", "I4:I12", "L4:L12", "O4:O12", "R4:R12", "U4:U12", "X4:X12"],
    NZBN: ["C15:C22", "F15:F22", "I15:I22", "L15:L22", "O15:O22", "R15:R22", "U15:U22", "X15:X22"],
    directors: ["B25:B", "E25:E", "H25:H", "K25:K", "N25:N", "Q25:Q", "T25:T", "W25:W"],
    directors_merged: ["B25:C34", "E25:F34", "H25:I34", "K25:L34", "N25:O34", "Q25:R34", "T25:U34", "W25:X34"],
    share: ["B37:C", "E37:F", "H37:I", "K37:L", "N37:O", "Q37:R", "T37:U", "W37:X"],
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
      let directors = this.directors[this.item] + String(dump[3].length + 24);
      let share = this.share[this.item] + String(dump[4].length + 36);
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
          console.log("Imported House NZ");
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
      console.log("House NZ Cleared");
    });
  });

  let config = (await loadConfig()).houseNZ;

  // Populate new data
  for (const item of config) {
    const data = await getHouseDataNZ(item.companyNumber);

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

export async function populateHouseUK() {
  let House = {
    //Stores excel index for data
    rows: ["2", "4", "8", "11", "12", "15", "24", "27"],
    name: ["B2", "E2", "H2", "K2", "N2", "Q2", "T2", "W2"],
    name_merged: ["B2:C2", "E2:F2", "H2:I2", "K2:L2", "N2:O2", "Q2:R2", "T2:U2", "W2:X2"],
    summary: ["C4:C8", "F4:F8", "I4:I8", "L4:L8", "O4:O8", "R4:R8", "U4:U8", "X4:X8"],
    accounts: ["C11:C12", "F11:F12", "I11:I12", "L11:L12", "O11:O12", "R11:R12", "U11:U12", "X11:X12"],
    directors: ["B15:B", "E15:E", "H15:H", "K15:K", "N15:N", "Q15:Q", "T15:T", "W15:W"],
    directors_merged: ["B15:C24", "E15:F24", "H15:I24", "K15:L24", "N15:O24", "Q15:R24", "T15:U24", "W15:X24"],
    // share: ["B36:C", "E36:F", "H36:I", "K36:L", "N36:O", "Q36:R", "T36:U", "W36:X"],

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
      let accounts = this.accounts[this.item];
      let directors = this.directors[this.item] + String(dump[3].length + 13);
      // let share = this.share[this.item] + String(dump[4].length + 35);
      this.item++;

      //add into cells
      Excel.run(function(context) {
        var sheet = context.workbook.worksheets.getItem("House_UK");
        sheet.getRange(name).values = dump[0];
        sheet.getRange(summary).values = dump[1];
        sheet.getRange(accounts).values = dump[2];
        sheet.getRange(directors).values = dump[3];
        // sheet.getRange(share).values = dump[4];
        return context.sync().then(function() {
          console.log("Imported House UK");
        });
      });
    }
  };

  // Clear old data
  Excel.run(function(context) {
    var sheet = context.workbook.worksheets.getItem("House_UK");
    sheet.getRanges(House.name_merged.toString()).clear("Contents");
    sheet.getRanges(House.summary.toString()).clear("Contents");
    sheet.getRanges(House.accounts.toString()).clear("Contents");
    sheet.getRanges(House.directors_merged.toString()).clear("Contents");
    // sheet.getRanges(House.share.reduce((prev, cur) => [...prev, cur + "10000"], []).toString()).clear("Contents");
    return context.sync().then(function() {
      console.log("House UK Cleared");
    });
  });

  let config = (await loadConfig()).houseUK;

  // Populate new data
  for (const item of config) {
    const data = await getHouseDataUK(item.companyNumber);

    //#region [rgba(70,20,20,0.5)] sample code region

    const summary = [
      [data.company_number],
      [
        data.registered_office_address.address_line_1 +
          ", " +
          data.registered_office_address.address_line_2 +
          ", " +
          data.registered_office_address.locality +
          " " +
          data.registered_office_address.postal_code
      ],
      [data.date_of_creation],
      [data.date_of_creation],
      [data.links.self]
    ];
    const name = data.company_name;
    const accounts = [[data.accounts.next_due], [data.accounts.overdue]];
    let directors = [];
    data.links.officers.forEach(director => {
      directors.push([director.name]);
    });
    // let shares = [];
    // let sharesKnown = 0;
    // data.INFO.SHAREHOLDINGS.allocation.forEach(shareholder => {
    //   shares.push([
    //     shareholder[1][0][0].toString(),
    //     Number(shareholder[0]) / Number(data.INFO.SHAREHOLDINGS.total_number_of_shares)
    //   ]);
    //   sharesKnown = sharesKnown + Number(shareholder[0]);
    // });
    // shares.push([
    //   "Unknown",
    //   (Number(data.INFO.SHAREHOLDINGS.total_number_of_shares) - sharesKnown) /
    //   Number(data.INFO.SHAREHOLDINGS.total_number_of_shares)
    // ]);

    const sample = [name, summary, accounts, directors];
    //stores companies house data
    House.store(sample);
    //#endregion
  }
}

export async function populateLinkedIn() {
  let Linkedin = {
    //Stores excel index for data
    company: [
      ["B2", "C4:C9", "B15"],
      ["E2", "F4:F9", "E15"],
      ["H2", "I4:I9", "H15"],
      ["K2", "L4:F9", "K15"],
      ["N2", "O4:O9", "N15"],

      ["B37", "C39:C44", "B50"],
      ["E37", "F39:F44", "E50"],
      ["H37", "I39:I44", "H50"],
      ["K37", "L39:F44", "K50"],
      ["N37", "O39:O44", "N50"],

      ["B71", "C73:C78", "B84"],
      ["E71", "F73:F78", "E84"],
      ["H71", "I73:I78", "H84"],
      ["K71", "L73:F78", "K84"],
      ["N71", "O73:O78", "N84"]
    ],
    company_merged: [
      ["B2:C2", "C4:C12", "B15:C34"],
      ["E2:F2", "F4:F12", "E15:F34"],
      ["H2:I2", "I4:I12", "H15:I34"],
      ["K2:L2", "L4:F12", "K15:L34"],
      ["N2:O2", "O4:O12", "N15:O34"],

      ["B37:C37", "C39:C47", "B50:C69"],
      ["E37:F37", "F39:F47", "E50:F69"],
      ["H37:I37", "I39:C47", "H50:I69"],
      ["K37:L37", "L39:F47", "K50:L69"],
      ["N37:O37", "O39:O47", "N50:O69"],

      ["B71:C71", "C73:C81", "B84:C103"],
      ["E71:F71", "F73:F81", "E84:F103"],
      ["H71:I71", "I73:C81", "H84:I103"],
      ["K71:L71", "L73:F81", "K84:L103"],
      ["N71:O71", "O73:O81", "N84:O103"]
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
    name: ["B2", "F2", "J2", "N2", "R2"],
    name_merged: ["B2:D2", "F2:H2", "J2:L2", "N2:P2", "R2:T2"],
    time_range: ["B3:C", "F3:G", "J3:K", "N3:O", "R3:S"],
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
    data: ["C3:C", "D3:D", "E3:E", "F3:F", "G3:G", "H3:H", "I3:I", "J3:J", "K3:K"],
    date: "B3:B",
    item: 0,

    store: function(dump: any[]) {
      /**
       *
       * @param {array} dump - A data dump in the form of a 3d array
       * dump = [
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
      let data = this.data[this.item] + String(dump[0].length + 2);
      let date;
      if (dump[1] != 0) {
        date = this.date + String(dump[1].length + 2);
      }
      this.item++;
      //add into cells
      Excel.run(function(context) {
        var sheet = context.workbook.worksheets.getItem("Trends");
        sheet.getRange(data).values = dump[0];
        if (dump[1] != 0) {
          sheet.getRange(date).values = dump[0];
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
    let trends = [];
    let dates = [];
    data.series.forEach(item => {
      trends.push([item[1]]);
      dates.push([item[0]]);
    });
    let sample = [trends, dates];
    //stores Google Trends data
    Trends.store(sample);
    //#endregion
  }
}
