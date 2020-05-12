"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var HeroList = /** @class */ (function (_super) {
    __extends(HeroList, _super);
    function HeroList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HeroList.prototype.render = function () {
        var _a = this.props, children = _a.children, items = _a.items, message = _a.message;
        var listItems = items.map(function (item, index) { return (React.createElement("li", { className: "ms-ListItem", key: index },
            React.createElement("i", { className: "ms-Icon ms-Icon--" + item.icon }),
            React.createElement("span", { className: "ms-font-m ms-fontColor-neutralPrimary" }, item.primaryText))); });
        return (React.createElement("main", { className: "ms-welcome__main" },
            React.createElement("h2", { className: "ms-font-xl ms-fontWeight-semilight ms-fontColor-neutralPrimary ms-u-slideUpIn20" }, message),
            React.createElement("ul", { className: "ms-List ms-welcome__features ms-u-slideUpIn10" }, listItems),
            children));
    };
    return HeroList;
}(React.Component));
exports.default = HeroList;
//# sourceMappingURL=HeroList.js.map