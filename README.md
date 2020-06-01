# Office 365 9 Spokes Integration

## Description

This is an Addin for Microsoft Excel which uses APIs to find public data sources such as

- Companies Office NZ
- Companies House UK
- Yahoo Finance
- Google Trends
- LinkedIn

and displays the data in a dashboard that the user can easily modify, use, and access.

## Running the Programme

Run the following script in your terminal from the root directory

```bash
npm stop
npm start
```

## Using the Programme

1. First open the taskpane by clicking the 9spokes logo on the far right hand side under the "Home" tab.
2. Click "Create workbook from template" and reopen the taskpane once the new workbook has been created.
3. Select the source you'd like to use to search for your company under the "Set-up" tab
4. Click "import".
5. The data should now be loaded and displayed in the dashboard

## Prerequisites

Follow [this tutorial from Microsoft](https://docs.microsoft.com/en-us/office/dev/add-ins/tutorials/excel-tutorial) which explains all the prerequisites

- [node js](https://nodejs.org/en/download/)
- [Yeoman](https://github.com/yeoman/yo) and [Yeoman Generator](https://github.com/OfficeDev/generator-office)
  Install these with the following command

```bash
npm install -g yo generator-office
```

## Installing

Clone or Download this repository and run the following script in your terminal from the root

directory of the project

```bash
npm install
```

## Report a bug or get further

To report a bug or get further help please visit the [9Spokes support page](https://support.9spokes.com/hc/en-us)

## Debugging

This app supports debugging using any of the following techniques:

- [Use a browser's developer tools](https://docs.microsoft.com/office/dev/add-ins/testing/debug-add-ins-in-office-online)
- [Attach a debugger from the task pane](https://docs.microsoft.com/office/dev/add-ins/testing/attach-debugger-from-task-pane)
- [Use F12 developer tools on Windows 10](https://docs.microsoft.com/office/dev/add-ins/testing/debug-add-ins-using-f12-developer-tools-on-windows-10)

## Additional Resources

- [Office add-in documentation](https://docs.microsoft.com/office/dev/add-ins/overview/office-add-ins)
- More Office Add-in samples at [OfficeDev on Github](https://github.com/officedev)

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
