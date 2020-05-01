/**
 * this is a file which allows the population of th eexcel spreadsheet through individual objects
 * a useful link is:
 * https://docs.microsoft.com/en-us/javascript/api/excel/excel.range?view=excel-js-preview#values
 * 
 * I have not finished adding docstrings nor enhancing it but everything should be working
 */
import { getData } from "./api";

export function populateHouse() {

  let House = {
    //Stores excel index for data
    name: ["B1", "E1", "H1", "K1", "N1"],
    summary: ["C3:C9", "F3:F9", "I3:I9", "L3:L9", "O3:O9"],
    NZBN: ["C12:C19", "F12:F19", "I12:I19", "L12:L19", "O12:O19"],
    directors: ["B22:B", "E22:E", "H22:H", "K22:K", "N22:N"],
    share: ["B34:C", "E34:F", "H34:I", "K34:L", "N34:O"],
    item: 0,

    store: function (dump: any[]) {
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
      * 
      *     
      */
      let name = this.name[this.item];
      let summary = this.summary[this.item];
      let NZBN = this.NZBN[this.item];
      let directors = this.directors[this.item] + String(dump[3].length + 21);
      let share = this.share[this.item] + String(dump[4].length + 33);
      this.item++;

      //add into cells
      Excel.run(function (context) {
        var sheet = context.workbook.worksheets.getItem("House");
        sheet.getRange(name).values = dump[0]
        sheet.getRange(summary).values = dump[1];
        sheet.getRange(NZBN).values = dump[2];
        sheet.getRange(directors).values = dump[3];
        sheet.getRange(share).values = dump[4];
        return context.sync().then(function () {
          console.log("Imported House");
        });
      });
    },
  };
  let data = getData("companies-register");

  //#region [rgba(70,20,20,0.5)] sample code region (color is for a vs code extension)
  let summary_sample = [
    [data.company_number],
    [data.nzbn],
    [data.incorporated],
    [data.current_status],
    [data.entity_type],
    [data.constitution_filed],
    [data.annual_return_filing_month]
  ];
  let name_sample = [["Company"]]
  let NZBN_sample = [["gst"], ["www.website.com"], ["911"], ["gmail"], ["name"], ["mars"], ["class"], ["ABN"]];
  let directors_sample = [];
  data.directors.forEach(director => {
    directors_sample.push([director[0]]);
  });
  let share_sample = [];
  data.shareholdings.shareholders.forEach(shareholder => {
    share_sample.push(
      data.shareholdings.extensive_shareholdings == "Yes"
        ? [shareholder[1], (100 / data.shareholdings.total_nuber_of_shares) * (shareholder[0] as number)]
        : [shareholder[0], "N/A"]
    );
  });

  let sample = [name_sample, summary_sample, NZBN_sample, directors_sample, share_sample];
  //stores companies house data
  House.store(sample);
  //#endregion
}


export function populateLinkedIn() {
  let Linkedin = {
    //Stores excel index for data
    person: [
      ["B1", "C3:C7", "B13"],
      ["B34", "C36:C40", "B46"],
      ["B67", "C69:C73", "B79"]
    ],
    company: [
      ["E1", "F3:F7", "E13"],
      ["E34", "F36:F40", "E46"],
      ["E67", "F69:F73", "E79"]
    ],
    item: 0,

    store: function (dump: any[]) {
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
      *                   "Alan",
      *                   [["professor"], ["Auckland"], ["www.auckland.ac.nz"], ["lots"], ["linkedin.com/whatever"]]
      *                   [["gst"], ["www.website.com"], ["911"], ["gmail"], ["name"], ["mars"], ["class"], ["ABN"]]
      *                   "about info"
      *               ]);
      */
      let person: boolean = dump[0];
      let name;
      let summary;
      let description;
      if (person) {
        name = this.person[this.item][0];
        summary = this.person[this.item][1];
        description = this.person[this.item][2];
      } else {
        name = this.company[this.item][0];
        summary = this.company[this.item][1];
        description = this.company[this.item][2];
      }
      this.item++;
      //add into cells
      Excel.run(function (context) {
        var sheet = context.workbook.worksheets.getItem("Linkedin");
        sheet.getRange(name).values = dump[1];
        sheet.getRange(summary).values = dump[2];
        sheet.getRange(description).values = dump[3];
        return context.sync().then(function () {
          console.log("Imported LinkedIn");
        });
      });
    }
  };

  //#region [rgba(20,20,50,0.5)] sample driver code
  let name_sample = "Alan";
  let summary_sample = [["lecturer"], ["Auckland"], ["www.auckland.ac.nz"], ["lots"], ["linkedin.com/whatever"]];
  let about_sample = "about info";
  let sample = [true, name_sample, summary_sample, about_sample];
  //stores LinkedIn data
  Linkedin.store(sample);
  //#endregion
}


export function populateFinance() {
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

    store: function (dump: any[]) {
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
      Excel.run(function (context) {
        var sheet = context.workbook.worksheets.getItem("Finance");
        sheet.getRange(name).values = dump[0];
        sheet.getRange(summary).values = dump[1];
        sheet.getRange(stocks).values = dump[2];
        return context.sync().then(function () {
          console.log("Imported Finance");
        });
      });
    }
  };

  //#region [rgba(20,50,20,0.5)] sample driver code
  let name_sample = "company";
  let summary_sample = [
    ["100B", "+20%"],
    ["200M", "+20%"],
    ["5%", "+20%"],
    ["50", "+20%"],
    ["300B", "+20%"],
    ["10", "+20%"]
  ];
  let stocks_sample = [
    ["10/10/20", 1],
    ["11/10/20", 1],
    ["12/10/20", 2],
    ["13/10/20", 3]
  ];
  let sample = [name_sample, summary_sample, stocks_sample];
  //stores finance data
  Finance.store(sample);
  //#endregion
}

export function populateTrends() {
  let Trends = {
    //Stores excel index for data
    summary: ["C2:C7", "D2:D7", "E2:E7", "F2:F7", "G2:G7"],
    data: ["C13:C", "D13:D", "F13:F", "F13:F", "G13:G"],
    date: "B13:B",
    item: 0,

    store: function (dump: any[]) {
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
      Excel.run(function (context) {
        var sheet = context.workbook.worksheets.getItem("Trends");
        sheet.getRange(summary).values = dump[0];
        sheet.getRange(data).values = dump[1];
        if (dump[2] != 0) {
          sheet.getRange(date).values = dump[2];
        }
        return context.sync().then(function () {
          console.log("Imported Trends");
        });
      });
    }
  };

  //#region [rgba(10,50,50,0.5)] sample driver code
  let summary_sample = [["1"], ["2"], ["3"], ["4"], ["5"], ["6"]];
  let data_sample = [[100], [90], [2], [3], [12], [30]];
  let sample = [summary_sample, data_sample, "0"];
  //stores Google Trends data
  Trends.store(sample);
  //#endregion

}

export function populateXero() {
  let Xero = {
    //Stores excel index for data
    summary: [],
    data: [],
    item: 0,

    store: function (dump: any[]) {
      /**
      *
      * @param {array} dump - A data dump in the form of a 3d array
      * 
      * @example
      * Trends.store([
      * 
      * 
      *               ]);
      */
      let summary = this.summary[0];
      let data = this.data[this.item] + String(dump[1].length + "START VALUE -1");
      this.item++;
      //add into cells
      Excel.run(function (context) {
        var sheet = context.workbook.worksheets.getItem("Xero");
        sheet.getRange(summary).values = dump[0];
        sheet.getRange(data).values = dump[1];
        return context.sync().then(function () {
          console.log("Imported Xero");
        });
      });
    }
  };

  //#region [rgba(50,20,50,0.5)] sample driver code
  let summary_sample = [["1"], ["2"], ["3"], ["4"], ["5"], ["6"]];
  let data_sample = [[100], [90], [2], [3], [12], [30]];
  let sample = [summary_sample, data_sample, "0"];
  //stores Xero data
  Xero.store(sample);
  //#endregion

  //#region [rgba(255,0,0,0.2)] sample test code for linking up to app.tsx
  Excel.run(function (context) {
    var sheet = context.workbook.worksheets.getItem("Xero");
    sheet.getRange("A1:A1").values = [["WORKS"]];
    return context.sync().then(function () {
      console.log("Imported Trends");
    });
  });
  //#endregion
}


export function populateFacebook() {
  let Facebook = {
    //Stores excel index for data
    summary: [],
    data: [],
    item: 0,

    store: function (dump: any[]) {
      /**
      *
      * @param {array} dump - A data dump in the form of a 3d array
      * 
      * @example
      * Facebook.store([
      * 
      * 
      *               ]);
      */
      let summary = this.summary[0];
      let data = this.data[this.item] + String(dump[1].length + "START VALUE -1");
      this.item++;
      //add into cells
      Excel.run(function (context) {
        var sheet = context.workbook.worksheets.getItem("Facebook");
        sheet.getRange(summary).values = dump[0];
        sheet.getRange(data).values = dump[1];
        return context.sync().then(function () {
          console.log("Imported Facebook");
        });
      });
    }
  };

  //#region [rgba(50,50,20,0.5)] sample driver code
  let summary_sample = [["1"], ["2"], ["3"], ["4"], ["5"], ["6"]];
  let data_sample = [[100], [90], [2], [3], [12], [30]];
  let sample = [summary_sample, data_sample, "0"];
  //stores Facebook data
  Facebook.store(sample);
  //#endregion

  //#region [rgba(255,0,0,0.2)] sample test code for linking up to app.tsx
  Excel.run(function (context) {
    var sheet = context.workbook.worksheets.getItem("Facebook");
    sheet.getRange("A1:A1").values = [["WORKS"]];
    return context.sync().then(function () {
      console.log("Imported Trends");
    });
  });
  //#endregion
}


export function populateTwitter() {
  let Twitter = {
    //Stores excel index for data
    summary: [],
    data: [],
    item: 0,

    store: function (dump: any[]) {
      /**
      *
      * @param {array} dump - A data dump in the form of a 3d array
      * 
      * @example
      * Twitter.store([
      * 
      * 
      *               ]);
      */
      let summary = this.summary[0];
      let data = this.data[this.item] + String(dump[1].length + "START VALUE -1");
      this.item++;
      //add into cells
      Excel.run(function (context) {
        var sheet = context.workbook.worksheets.getItem("Twitter");
        sheet.getRange(summary).values = dump[0];
        sheet.getRange(data).values = dump[1];
        return context.sync().then(function () {
          console.log("Imported Twitter");
        });
      });
    }
  };

  //#region [rgba(40,60,80,0.5)] sample driver code
  let summary_sample = [["1"], ["2"], ["3"], ["4"], ["5"], ["6"]];
  let data_sample = [[100], [90], [2], [3], [12], [30]];
  let sample = [summary_sample, data_sample, "0"];
  //stores Twitter data
  Twitter.store(sample);
  //#endregion

  //#region [rgba(255,0,0,0.2)] sample test code for linking up to app.tsx
  Excel.run(function (context) {
    var sheet = context.workbook.worksheets.getItem("Twitter");
    sheet.getRange("A1:A1").values = [["WORKS"]];
    return context.sync().then(function () {
      console.log("Imported Trends");
    });
  });
  //#endregion
}