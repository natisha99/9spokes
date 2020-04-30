//untested


//https://docs.microsoft.com/en-us/javascript/api/excel/excel.range?view=excel-js-preview#values
//import { getData } from "./api";


export function Populate_house() {
  let House = {
    //Stores excel index for data
    summary: ["C3:C9", "F3:F9", "I3:I9", "L3:L9", "O3:O9"],
    NZBN: ["C12:C19", "F12:F19", "I12:I19", "L12:L19", "O12:O19"],
    directors: ["B22:B31", "E22:E31", "H22:H31", "K22:K31", "N22:N31"],
    share: ["C34:C200", "F34:F200", "I34:I200", "L34:L200", "O34:O200"],
    item: 0,

    store: function (dump: any[]) {
      //3d array [[[summary]],[[NZBN]],[[directors]],[[shares]]] where each contains a 2d array
      //for some reason this. didnt work inside excel.run  so I had to do this
      let summary = this.summary[this.item]
      let NZBN = this.NZBN[this.item]
      let directors = this.directors[this.item]
      let share = this.share[this.item]
      this.item++
      //format data
      while (dump[3].length < 167) {
        dump[3].push([""])
      }
      while (dump[2].length < 10) {
        dump[2].push([""])
      }
      //add into cells
      Excel.run(function (context) {
        var sheet = context.workbook.worksheets.getItem("House");
        sheet.getRange(summary).values = dump[0];
        sheet.getRange(NZBN).values = dump[1];
        sheet.getRange(directors).values = dump[2];
        sheet.getRange(share).values = dump[3];
        return context.sync()
          .then(function () {
            console.log("Done");
          })
      })
    },

    __init__: function () {
      //yes this is inefficient but its flexible I'll make it more efficient later

    }
  }

  //sample driver code
  let summary_sample = [[1], [2], ["2012"], ['active'], ["big one"], ["yep"], ["feb"]]
  let NZBN_sample = [["gst"], ["www.website.com"], ["911"], ["gmail"], ["name"], ["mars"], ["class"], ["ABN"]]
  let directors_sample = [["fred"], ["steve"], ["mary"], ["alfred"], ["jan"], ["big mama"], ["bob"]]
  let share_sample = [[0.2], [0.1], [0.5], [0.2]]
  let sample = [summary_sample, NZBN_sample, directors_sample, share_sample]
  //stores companies house data
  House.store(sample);
  // const data = getData('companies-register');


}

export function populate_LinkedIn() {
  let Linkedin = {
    //Stores excel index for data
    person: ["B1", "C3:C7", "B13", "B34", "C36:C40", "B46", "B67", "C69:C73", "B79"],
    company: ["E1", "F3:F7", "E13", "E34", "F36:F40", "E46", "E67", "F69:F73", "E79"],
    item: 0,

    store: function (dump: any[]) {
      //2d array [(company/person),[7 elements]] holding data about either a person or company where each contains a 2d array
      //the first element holds a boolean if its a person or a company
      //for some reason this. didnt work inside excel.run  so I had to do this
      let person: boolean = dump[0];
      let summary: string;
      if (person) {
        summary = this.person[3 * this.item] + this.person[(3 * this.item) + 1]
      } else {
        summary = this.company[3 * this.item] + this.company[(3 * this.item) + 1]
      }
      this.item++
      //add into cells
      Excel.run(function (context) {
        var sheet = context.workbook.worksheets.getItem("Linkedin");
        sheet.getRange(summary).values = dump[1];
        return context.sync()
          .then(function () {
            console.log("Done");
          })
      })
    },
  }

  //sample driver code
  let sample = [true, ["Alan", "professor", "Auckland", "www.auckland.ac.nz", "lots", "linkedin.com/whatever", "about info"]]
  //stores LinkedIn data
  Linkedin.store(sample);

  // const data = getData('companies-register');


}



export function Populate_finance() {
  let Finance = {
    //Stores excel index for data
    summary: ["B1,C3:D8", "F1,G3:H8", "J1,K3:L8", "N1,O3:P8", "R1,S3:T8"],
    stocks: ["B13:C200", "F13:G200", "J13:K200", "N13:O200", "R13:S200"],
    item: 0,

    store: function (dump: any[]) {
      //3d array [[[summary]],[[Stocks]]] where each contains a 2d array
      //for some reason this. didnt work inside excel.run  so I had to do this
      let summary = this.summary[this.item];
      let stocks = this.stocks[this.item];
      this.item++
      //format data
      while (dump[1].length < 374) {
        dump[1].push([""])
      }
      //add into cells
      Excel.run(function (context) {
        var sheet = context.workbook.worksheets.getItem("Finance");
        sheet.getRange(summary).values = dump[0];
        sheet.getRange(stocks).values = dump[1];
        return context.sync()
          .then(function () {
            console.log("Done");
          })
      })
    },
  }

  //sample driver code
  let summary_sample = [["not flix"], ["100B"], ["+20%"], ["200M"], ["+20%"], ["5%"], ["+20%"], ["50"], ["+20%"], ["300B"], ["+20%"], ["10"], ["+20%"]]
  let stocks_sample = [["10/10/20"], [1], ["11/10/20"], [1], ["12/10/20"], [2], ["13/10/20"], [3]]
  let sample = [summary_sample, stocks_sample,]
  //stores companies house data
  Finance.store(sample);


}