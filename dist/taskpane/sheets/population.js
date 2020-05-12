"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * this is a file which allows the population of the excel spreadsheet through individual objects
 * a useful link is:
 * https://docs.microsoft.com/en-us/javascript/api/excel/excel.range?view=excel-js-preview#values
 *
 * I have not finished adding docstrings nor enhancing it but everything should be working
 */
var api_1 = require("./api");
var config_1 = require("./config");
function populateHouse() {
    return __awaiter(this, void 0, void 0, function () {
        var House, config, data, summary_sample, name_sample, NZBN_sample, directors_sample, share_sample, share_sample_known, sample;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    House = {
                        //Stores excel index for data
                        name: ["B1", "E1"],
                        summary: ["C3:C11", "F3:F11"],
                        NZBN: ["C14:C21", "F14:F21"],
                        directors: ["B24:B", "E24:E"],
                        share: ["B36:C", "E36:F"],
                        item: 0,
                        store: function (dump) {
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
                            var name = this.name[this.item];
                            var summary = this.summary[this.item];
                            var NZBN = this.NZBN[this.item];
                            var directors = this.directors[this.item] + String(dump[3].length + 23);
                            var share = this.share[this.item] + String(dump[4].length + 35);
                            this.item++;
                            //add into cells
                            Excel.run(function (context) {
                                var sheet = context.workbook.worksheets.getItem("House");
                                sheet.getRange(name).values = dump[0];
                                sheet.getRange(summary).values = dump[1];
                                sheet.getRange(NZBN).values = dump[2];
                                sheet.getRange(directors).values = dump[3];
                                sheet.getRange(share).values = dump[4];
                                return context.sync().then(function () {
                                    console.log("Imported House");
                                });
                            });
                        }
                    };
                    return [4 /*yield*/, config_1.loadConfig()];
                case 1:
                    config = (_a.sent()).house[0];
                    return [4 /*yield*/, api_1.getHouseData(config.companyNumber)];
                case 2:
                    data = _a.sent();
                    summary_sample = [
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
                    name_sample = data.NAME;
                    NZBN_sample = [["TODO"], ["TODO"], ["TODO"], ["TODO"], ["TODO"], ["TODO"], [data.INFO.NZBN.industry], ["TODO"]];
                    directors_sample = [];
                    data.INFO.DIRECTORS.forEach(function (director) {
                        directors_sample.push([director.full_legal_name]);
                    });
                    share_sample = [];
                    share_sample_known = 0;
                    data.INFO.SHAREHOLDINGS.allocation.forEach(function (shareholder) {
                        share_sample.push([
                            shareholder[1][0][0].toString(),
                            Number(shareholder[0]) / Number(data.INFO.SHAREHOLDINGS.total_number_of_shares)
                        ]);
                        share_sample_known = share_sample_known + Number(shareholder[0]);
                    });
                    share_sample.push([
                        "Unknown",
                        (Number(data.INFO.SHAREHOLDINGS.total_number_of_shares) - share_sample_known) /
                            Number(data.INFO.SHAREHOLDINGS.total_number_of_shares)
                    ]);
                    sample = [name_sample, summary_sample, NZBN_sample, directors_sample, share_sample];
                    //stores companies house data
                    House.store(sample);
                    return [2 /*return*/];
            }
        });
    });
}
exports.populateHouse = populateHouse;
function populateLinkedIn() {
    var Linkedin = {
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
        store: function (dump) {
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
            var person = dump[0];
            var name;
            var summary;
            var description;
            if (person) {
                name = this.person[this.item][0];
                summary = this.person[this.item][1];
                description = this.person[this.item][2];
            }
            else {
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
    var name_sample = "Alan";
    var summary_sample = [["lecturer"], ["Auckland"], ["www.auckland.ac.nz"], ["lots"], ["linkedin.com/whatever"]];
    var about_sample = "about info";
    var sample = [true, name_sample, summary_sample, about_sample];
    //stores LinkedIn data
    Linkedin.store(sample);
    //#endregion
}
exports.populateLinkedIn = populateLinkedIn;
function populateFinance() {
    return __awaiter(this, void 0, void 0, function () {
        var Finance, config, data, name_sample, summary_sample, stocks_sample, sample;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Finance = {
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
                        store: function (dump) {
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
                            var name = this.summary[this.item][0];
                            var summary = this.summary[this.item][1];
                            var stocks = this.stocks[this.item] + String(dump[2].length + 12);
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
                    return [4 /*yield*/, config_1.loadConfig()];
                case 1:
                    config = (_a.sent()).finance[0];
                    return [4 /*yield*/, api_1.getFinanceData(config.ticker, config.interval, config.range)];
                case 2:
                    data = (_a.sent()).chart.result[0];
                    name_sample = data.meta.symbol;
                    summary_sample = [
                        ["100B", "+TODO%"],
                        ["200M", "+TODO%"],
                        ["5%", "+TODO%"],
                        ["50", "+TODO%"],
                        ["300B", "+TODO%"],
                        ["10", "+TODO%"]
                    ];
                    stocks_sample = [];
                    data.timestamp.forEach(function (day, index) {
                        var date = new Date(day * 1000);
                        stocks_sample.push([
                            date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear(),
                            data.indicators.adjclose[0].adjclose[index]
                        ]);
                    });
                    sample = [name_sample, summary_sample, stocks_sample];
                    //stores finance data
                    Finance.store(sample);
                    return [2 /*return*/];
            }
        });
    });
}
exports.populateFinance = populateFinance;
function populateTrends() {
    return __awaiter(this, void 0, void 0, function () {
        var Trends, config, data, summary_sample, data_sample, date_sample, sample;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Trends = {
                        //Stores excel index for data
                        summary: ["C2:C7", "D2:D7", "E2:E7", "F2:F7", "G2:G7"],
                        data: ["C13:C", "D13:D", "F13:F", "F13:F", "G13:G"],
                        date: "B13:B",
                        item: 0,
                        store: function (dump) {
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
                            var summary = this.summary[0];
                            var data = this.data[this.item] + String(dump[1].length + 12);
                            var date;
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
                    return [4 /*yield*/, config_1.loadConfig()];
                case 1:
                    config = (_a.sent()).trends[0];
                    return [4 /*yield*/, api_1.getTrendsData(config.keyword, config.weeks)];
                case 2:
                    data = _a.sent();
                    console.log(data);
                    summary_sample = [[config.keyword], ["TODO"], ["TODO"], ["TODO"], ["TODO"], ["TODO"]];
                    data_sample = [];
                    date_sample = [];
                    data.series.forEach(function (item) {
                        data_sample.push([item[1]]);
                        date_sample.push([item[0]]);
                    });
                    sample = [summary_sample, data_sample, date_sample];
                    //stores Google Trends data
                    Trends.store(sample);
                    return [2 /*return*/];
            }
        });
    });
}
exports.populateTrends = populateTrends;
function populateXero() {
    var Xero = {
        //Stores excel index for data
        summary: [],
        data: [],
        item: 0,
        store: function (dump) {
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
            var summary = this.summary[0];
            var data = this.data[this.item] + String(dump[1].length + "START VALUE -1");
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
    var summary_sample = [["1"], ["2"], ["3"], ["4"], ["5"], ["6"]];
    var data_sample = [[100], [90], [2], [3], [12], [30]];
    var sample = [summary_sample, data_sample, "0"];
    //stores Xero data
    Xero.store(sample);
    //#endregion
    //#region [rgba(255,0,0,0.2)] sample test code for linking up to app.tsx
    Excel.run(function (context) {
        var sheet = context.workbook.worksheets.getItem("Xero");
        sheet.getRange("A1:A1").values = [["WORKS"]];
        return context.sync().then(function () {
            console.log("Imported Xero");
        });
    });
    //#endregion
}
exports.populateXero = populateXero;
function populateFacebook() {
    var Facebook = {
        //Stores excel index for data
        summary: [],
        data: [],
        item: 0,
        store: function (dump) {
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
            var summary = this.summary[0];
            var data = this.data[this.item] + String(dump[1].length + "START VALUE -1");
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
    var summary_sample = [["1"], ["2"], ["3"], ["4"], ["5"], ["6"]];
    var data_sample = [[100], [90], [2], [3], [12], [30]];
    var sample = [summary_sample, data_sample, "0"];
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
exports.populateFacebook = populateFacebook;
//# sourceMappingURL=population.js.map