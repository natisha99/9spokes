//import { getData } from "./api";

export function populateTable() {

    let Linkedin = {
      //Stores excel index for data
      //https://docs.microsoft.com/en-us/javascript/api/excel/excel.range?view=excel-js-preview#values
      person: ["C3:C7", "B13", "C36:C40", "B46", "C69:C73", "B79"],
      company: ["F3:F7", "E13", "F36:F40", "E46", "F69:F73", "E79"],
      item: 0,
  
      store: function (dump: any[]) {
        //2d array [(company/person)[7 elements]] holding data about either a person or company where each contains a 2d array
        //the first element holds a boolean if its a person or a company
        //for some reason this. didnt work inside excel.run  so I had to do this
        let person:boolean = dump[0]
        let summary: string
        if(person){
            summary = this.person[2*this.item] + this.person[(2*this.item)+1]
        } else{
            summary = this.company[2*this.item] + this.company[(2*this.item)+1]
        }
        this.item++
        //set data into 
        //add into cells
        Excel.run(function (context) {
          var sheet = context.workbook.worksheets.getItem("Linkedin");
          sheet.getRange(summary).values = dump[1];
          return context.sync()
            .then(function () {
              console.log("done");
            })
        })
      },
  
      __init__: function () {
        //yes this is inefficient but its flexible I'll make it more efficient later
  
      }
    }
  
    //sample driver code
    let sample = [true,["professor","Auckland","www.auckland.ac.nz","lots","linkedin.com/whatever"]]
    //stores companies house data
    Linkedin.store(sample);
    /*
    good code for testing
    var sheet = context.workbook.worksheets.getItem("House");
    var cell = sheet.getRange("C3:C4");
    var data:any[][] = [["data"],[1]]
    cell.values = data;
    */
  
    // const data = getData('companies-register');
  
  
  }