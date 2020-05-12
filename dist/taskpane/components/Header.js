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
var Header = /** @class */ (function (_super) {
    __extends(Header, _super);
    function Header() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Header.prototype.render = function () {
        var _a = this.props, title = _a.title, logo = _a.logo, message = _a.message;
        return (React.createElement("section", { className: "ms-welcome__header ms-bgColor-neutralLighter ms-u-fadeIn500" },
            React.createElement("img", { width: "100", height: "100", src: logo, alt: title, title: title }),
            React.createElement("h1", { style: { margin: 0 }, className: "ms-fontSize-su ms-fontWeight-light ms-fontColor-neutralPrimary" }, message)));
    };
    return Header;
}(React.Component));
exports.default = Header;
//# sourceMappingURL=Header.js.map