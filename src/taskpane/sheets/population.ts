/**
 * @fileoverview this is a file which allows the population of the excel spreadsheet through individual objects.
 * @package
 * @function populateHouse()
 * @function populateLinkedIn()
 * @function populateFinance()
 * @function populateTrends()
 */
import { getHouseDataNZ, getFinanceData, getTrendsData, getLinkedinData, getHouseDataUK } from "./api";
import { loadConfig } from "./config";
import { setSheetDimensions, clearSheet } from "./utils";

export async function populateHouseNZ() {
  let House = {
    itemIndex: 0,
    rowHeightSet: false,

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
    store: async function(dump: any[]) {
      // Generate template and populate data
      await Excel.run(async function(context) {
        const sheet = context.workbook.worksheets.getItem("House_NZ");
        const template = context.workbook.worksheets.getItem("Templates").getRange("HouseNZTemplate");
        // Adjust sheet dimensions
        await setSheetDimensions(context, sheet, template, House.itemIndex, House.rowHeightSet);
        // Prevent row heights being adjusted again
        if (!House.rowHeightSet) {
          House.rowHeightSet = true;
        }
        sheet.getRangeByIndexes(0, House.itemIndex, 1, 1).copyFrom(template, Excel.RangeCopyType.all);
        sheet.getRangeByIndexes(0, House.itemIndex + 1, 1, 1).values = dump[0];
        sheet.getRangeByIndexes(2, House.itemIndex + 2, 9, 1).values = dump[1];
        sheet.getRangeByIndexes(13, House.itemIndex + 2, 8, 1).values = dump[2];
        sheet.getRangeByIndexes(23, House.itemIndex + 1, dump[3].length, 1).values = dump[3];
        sheet.getRangeByIndexes(35, House.itemIndex + 1, dump[4].length, 2).values = dump[4];
        return context.sync().then(function() {
          console.log("Imported House NZ");
        });
      });
      this.itemIndex += 3;
    }
  };

  // Clear old data
  clearSheet("House_NZ");

  let config = (await loadConfig()).houseNZ;

  // Populate new data
  for (const item of config) {
    const data = await getHouseDataNZ(item.companyNumber);

    //#region [rgba(70,20,20,0.5)] sample code region
    const summary = [
      [String(data.INFO.SUMMARY.company_number)],
      [String(data.INFO.SUMMARY.nzbn)],
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
    await House.store(sample);
    //#endregion
  }
}

export async function populateHouseUK() {
  let House = {
    itemIndex: 0,
    rowHeightSet: false,

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
    store: async function(dump: any[]) {
      // Generate template and populate data
      await Excel.run(async function(context) {
        const sheet = context.workbook.worksheets.getItem("House_UK");
        const template = context.workbook.worksheets.getItem("Templates").getRange("HouseUKTemplate");
        // Adjust sheet dimensions
        await setSheetDimensions(context, sheet, template, House.itemIndex, House.rowHeightSet);
        // Prevent row heights being adjusted again
        if (!House.rowHeightSet) {
          House.rowHeightSet = true;
        }
        sheet.getRangeByIndexes(0, House.itemIndex, 1, 1).copyFrom(template, Excel.RangeCopyType.all);
        sheet.getRangeByIndexes(0, House.itemIndex + 1, 1, 1).values = dump[0];
        sheet.getRangeByIndexes(2, House.itemIndex + 2, 5, 1).values = dump[1];
        sheet.getRangeByIndexes(9, House.itemIndex + 2, 2, 1).values = dump[2];
        sheet.getRangeByIndexes(13, House.itemIndex + 1, dump[3].length, 1).values = dump[3];
        sheet.getRangeByIndexes(25, House.itemIndex + 1, dump[4].length, 1).values = dump[4];
        return context.sync().then(function() {
          console.log("Imported House UK");
        });
      });
      this.itemIndex += 3;
    }
  };

  // Clear old data
  clearSheet("House_UK");

  let config = (await loadConfig()).houseUK;

  // Populate new data
  for (const item of config) {
    const data = await getHouseDataUK(item.companyNumber);

    //#region [rgba(70,20,20,0.5)] sample code region
    const name = data.company_name;
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
      [data.date_retrieved],
      [data.url]
    ];
    const accounts = [[data.accounts.next_due], [data.accounts.overdue]];
    let directors = [];
    if (Object.keys(data.links.officers).length !== 0) {
      data.links.officers.forEach(director => {
        directors.push([director.name]);
      });
    }
    let shareHolders = [];
    if (Object.keys(data.links.persons_with_significant_control).length !== 0) {
      data.links.persons_with_significant_control.forEach(shareHolder => {
        shareHolders.push([shareHolder.name]);
      });
    }
    const sample = [name, summary, accounts, directors, shareHolders];
    //stores companies house data
    await House.store(sample);
    //#endregion
  }
}

export async function populateLinkedIn() {
  let Linkedin = {
    itemIndex: 0,
    rowHeightSet: false,

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
    store: async function(dump: any[]) {
      // Generate template and populate data
      await Excel.run(async function(context) {
        const sheet = context.workbook.worksheets.getItem("Linkedin");
        const template = context.workbook.worksheets.getItem("Templates").getRange("LinkedinTemplate");
        // Adjust sheet dimensions
        await setSheetDimensions(context, sheet, template, Linkedin.itemIndex, Linkedin.rowHeightSet);
        // Prevent row heights being adjusted again
        if (!Linkedin.rowHeightSet) {
          Linkedin.rowHeightSet = true;
        }
        sheet.getRangeByIndexes(0, Linkedin.itemIndex, 1, 1).copyFrom(template, Excel.RangeCopyType.all);
        sheet.getRangeByIndexes(0, Linkedin.itemIndex + 1, 1, 1).values = dump[0];
        sheet.getRangeByIndexes(2, Linkedin.itemIndex + 2, 6, 1).values = dump[1];
        sheet.getRangeByIndexes(13, Linkedin.itemIndex + 1, 1, 1).values = dump[2];
        return context.sync().then(function() {
          console.log("Imported LinkedIn");
        });
      });
      this.itemIndex += 3;
    }
  };

  // Clear old data
  clearSheet("Linkedin");

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
    await Linkedin.store(sample);
    //#endregion
  }
}

export async function populateFinance() {
  let Finance = {
    itemIndex: 0,
    rowHeightSet: false,

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
    store: async function(dump: any[]) {
      // Generate template and populate data
      await Excel.run(async function(context) {
        const sheet = context.workbook.worksheets.getItem("Finance");
        const template = context.workbook.worksheets.getItem("Templates").getRange("FinanceTemplate");
        // Adjust sheet dimensions
        await setSheetDimensions(context, sheet, template, Finance.itemIndex, Finance.rowHeightSet);
        // Prevent row heights being adjusted again
        if (!Finance.rowHeightSet) {
          Finance.rowHeightSet = true;
        }
        sheet.getRangeByIndexes(0, Finance.itemIndex, 1, 1).copyFrom(template, Excel.RangeCopyType.all);
        sheet.getRangeByIndexes(0, Finance.itemIndex + 1, 1, 1).values = dump[0];
        sheet.getRangeByIndexes(3, Finance.itemIndex + 1, dump[1].length, 2).values = dump[1];
        return context.sync().then(function() {
          console.log("Imported Finance");
        });
      });
      this.itemIndex += 4;
    }
  };

  // Clear old data
  clearSheet("Finance");

  let config = (await loadConfig()).finance;

  // Populate new data
  for (const item of config) {
    const data = (await getFinanceData(item.ticker, item.interval, item.range)).chart.result[0];

    //#region [rgba(20,50,20,0.5)] sample driver code
    let name = data.meta.symbol;
    let utc_offset = data.meta.gmtoffset;
    let stocks_sample = [];
    data.timestamp.forEach((day, index) => {
      const date = new Date((day + utc_offset) * 1000);
      stocks_sample.push([
        //`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
        date.toDateString(),
        data.indicators.adjclose[0].adjclose[index]
      ]);
    });

    let sample = [name, stocks_sample];
    //stores finance data
    await Finance.store(sample);
    //#endregion
  }
}

export async function populateTrends() {
  let Trends = {
    itemIndex: 0,
    rowHeightSet: false,

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
    store: async function(dump: any[]) {
      // Generate template and populate data
      await Excel.run(async function(context) {
        const sheet = context.workbook.worksheets.getItem("Trends");
        // Generate and populate date template when adding the first item
        if (Trends.itemIndex == 0) {
          const template = context.workbook.worksheets.getItem("Templates").getRange("TrendsDateTemplate");
          // Adjust sheet dimensions
          await setSheetDimensions(context, sheet, template, Trends.itemIndex, Trends.rowHeightSet);
          // Prevent row heights being adjusted again
          Trends.rowHeightSet = true;
          sheet.getRangeByIndexes(0, Trends.itemIndex, 1, 1).copyFrom(template, Excel.RangeCopyType.all);
          sheet.getRangeByIndexes(1, Trends.itemIndex + 1, dump[2].length, 1).values = dump[2];
          Trends.itemIndex += 2;
        }
        // Generate and populate data template
        const template = context.workbook.worksheets.getItem("Templates").getRange("TrendsDataTemplate");
        // Adjust sheet dimensions
        await setSheetDimensions(context, sheet, template, Trends.itemIndex, Trends.rowHeightSet);
        sheet.getRangeByIndexes(0, Trends.itemIndex, 1, 1).copyFrom(template, Excel.RangeCopyType.all);
        sheet.getRangeByIndexes(0, Trends.itemIndex, 1, 1).values = dump[0];
        sheet.getRangeByIndexes(1, Trends.itemIndex, dump[1].length, 1).values = dump[1];
        return context.sync().then(function() {
          console.log("Imported Trends");
        });
      });
      this.itemIndex += 1;
    }
  };

  // Clear old data
  clearSheet("Trends");

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
    let sample = [item.keyword, trends, dates];
    //stores Google Trends data
    await Trends.store(sample);
    //#endregion
  }
}
