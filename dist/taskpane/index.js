"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("office-ui-fabric-react/dist/css/fabric.min.css");
var App_1 = require("./components/App");
var react_hot_loader_1 = require("react-hot-loader");
var Icons_1 = require("office-ui-fabric-react/lib/Icons");
var React = require("react");
var ReactDOM = require("react-dom");
/* global AppCpntainer, Component, document, Office, module, require */
Icons_1.initializeIcons();
var isOfficeInitialized = false;
var title = "9Spokes Integration";
var render = function (Component) {
    ReactDOM.render(React.createElement(react_hot_loader_1.AppContainer, null,
        React.createElement(Component, { title: title, isOfficeInitialized: isOfficeInitialized })), document.getElementById("container"));
};
/* Render application after Office initializes */
Office.initialize = function () {
    isOfficeInitialized = true;
    render(App_1.default);
};
/* Initial render showing a progress bar */
render(App_1.default);
if (module.hot) {
    module.hot.accept("./components/App", function () {
        var NextApp = require("./components/App").default;
        render(NextApp);
    });
}
//# sourceMappingURL=index.js.map