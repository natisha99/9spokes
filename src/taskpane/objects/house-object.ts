let House = {
  //Stores excel index for data
  summary: [],
  NZBN: [],
  direct_index: [],
  share: [],
  column: "c",
  Xoffset: 3,
  //array for each companies data
  name: [],
  number: [],
  NZBN_data: [],
  data: [],
  status: [],
  type: [],
  filed: [],
  month: [],

  gst: [],
  website: [],
  phone: [],
  email: [],
  trading_name: [],
  area: [],
  classification: [],
  ABN: [],

  directors: [[]],

  Xinc: function() {
    this.column = String.fromCharCode(this.column.charCodeAt(0) + 3);
    this.__init__();
  },
  store: function() {
    //add this method to store the data into excel
  },
  __init__: function() {
    //yes this is inefficient but its flexible I'll make it more efficient later
    for (let i = 3; i <= 9; i++) {
      this.summary.push(this.column + i);
    }
    for (let i = 12; i <= 19; i++) {
      this.NZBN.push(this.column + i);
    }
    let Dircolumn = String.fromCharCode(this.column.charCodeAt(0) - 1);
    for (let i = 22; i <= 31; i++) {
      this.direct_index.push(Dircolumn + i);
    }
    for (let i = 34; i <= 300; i++) {
      this.share.push(this.column + i);
    }
  }
};
