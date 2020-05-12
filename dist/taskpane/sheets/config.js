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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
function loadConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Excel.run(function (context) {
                        var sheet = context.workbook.worksheets.getItem("Config");
                        var house = sheet.tables.getItem("House").rows.load();
                        var linkedin = sheet.tables.getItem("Linkedin").rows.load();
                        var finance = sheet.tables.getItem("Finance").rows.load();
                        var trends = sheet.tables.getItem("Trends").rows.load();
                        return context.sync().then(function () {
                            config = {
                                house: house.items.reduce(function (prev, cur) { return __spreadArrays(prev, [JSON.parse(cur.values[0][0])]); }, []),
                                linkedin: linkedin.items.reduce(function (prev, cur) { return __spreadArrays(prev, [JSON.parse(cur.values[0][0])]); }, []),
                                finance: finance.items.reduce(function (prev, cur) { return __spreadArrays(prev, [JSON.parse(cur.values[0][0])]); }, []),
                                trends: trends.items.reduce(function (prev, cur) { return __spreadArrays(prev, [JSON.parse(cur.values[0][0])]); }, [])
                            };
                            console.log("Loaded Config");
                        });
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, config];
            }
        });
    });
}
exports.loadConfig = loadConfig;
function saveConfig(config) {
    Excel.run(function (context) {
        var sheet = context.workbook.worksheets.getItem("Config");
        var house = sheet.tables.getItem("House").rows.load();
        var linkedin = sheet.tables.getItem("Linkedin").rows.load();
        var finance = sheet.tables.getItem("Finance").rows.load();
        var trends = sheet.tables.getItem("Trends").rows.load();
        return context.sync().then(function () {
            config.house.forEach(function (item, index) { return (house.items[index].values = [[JSON.stringify(item)]]); });
            config.linkedin.forEach(function (item, index) { return (linkedin.items[index].values = [[JSON.stringify(item)]]); });
            config.finance.forEach(function (item, index) { return (finance.items[index].values = [[JSON.stringify(item)]]); });
            config.trends.forEach(function (item, index) { return (trends.items[index].values = [[JSON.stringify(item)]]); });
            console.log("Saved Config");
        });
    });
}
exports.saveConfig = saveConfig;
//# sourceMappingURL=config.js.map