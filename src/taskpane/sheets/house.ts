//import { getData } from "./api";

export function populateTable() {

  let House = {
    //Stores excel index for data
    //https://docs.microsoft.com/en-us/javascript/api/excel/excel.range?view=excel-js-preview#values
    summary: ["C3:C9","F3:F9","I3:I9","L3:L9","O3:O9"],
    NZBN: ["C12:C19","F12:F19","I12:I19","L12:L19","O12:O19"],
    directors: ["B22:B31","E22:E31","H22:H31","K22:K31","N22:N31"],
    share: ["C34:C200","F34:F200","I34:I200","L34:L200","O34:O200"],
    item: -1,
  
    store: function(dump:any[]){
      //3d array [summary,NZBN,directors,shares] where each contains a 2d array
      //for some reason this. didnt work inside excel.run  so I had to do this
      let summary = this.summary
      let NZBN = this.NZBN
      let directors = this.directors
      let share = this.share
      this.item++
      let item =this.item
      //format data
      while(dump[3].length<167){
        dump[3].push([""])
      }
      while(dump[2].length<10){
        dump[2].push([""])
      }
      //add into cells
      Excel.run(function (context) {
        var sheet = context.workbook.worksheets.getItem("House");
        sheet.getRange(summary[item]).values =dump[0];
        sheet.getRange(NZBN[item]).values =dump[1];
        sheet.getRange(directors[item]).values =dump[2];
        sheet.getRange(share[item]).values =dump[3];
        return context.sync()
            .then(function() {
                console.log("sas");
            })
      })
    },
  
    __init__:function(){
        //yes this is inefficient but its flexible I'll make it more efficient later
  
    }
  }

  //sample driver code
  let summary_sample =[[1],[2],["2012"],['active'],["big one"],["yep"],["feb"]]
  let NZBN_sample = [["gst"],["www.website.com"],["911"],["gmail"],["name"],["mars"],["class"],["ABN"]]
  let directors_sample = [["fred"],["steve"],["mary"],["alfred"],["jan"],["big mama"],["bob"]]
  let share_sample = [[0.2],[0.1],[0.5],[0.2]]
  let sample = [summary_sample, NZBN_sample, directors_sample, share_sample]
  //stores companies house data
  House.store(sample);
  /*
  good code for testing
  var sheet = context.workbook.worksheets.getItem("House");
  var cell = sheet.getRange("C3:C4");
  var data:any[][] = [["data"],[1]]
  cell.values = data;
  */

  // const data = getData('companies-register');

  
}