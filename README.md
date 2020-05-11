# Office 365 9 Spokes Integration

## Description

This is an Addin for Microsoft Excel which uses APIs to find public data sources such as

- Companies Office
- Yahoo Finance
- Google Trends
- LinkedIn

and displays the data in a dashboard that the user can easily modify, use, and access

## Running the Program

run the following script in your terminal from the root directory

```bash
npm stop
npm start
```

## Installing

run the following script in your terminal from the root directory

```bash
npm install
```

## Current APIs

### we dont have to impliment all of them but this is the best and most useful APIs I've found

### [Companies office](https://api.business.govt.nz/api/)

- directors
- share holding allocations

### [Google Trends](https://www.npmjs.com/package/google-trends-api)

- search frequency of terms
  - by geolocation
  - by time zone
  - by langauge

### [Yahoo Finance](https://rapidapi.com/apidojo/api/yahoo-finance1)

- market summary
- market quotes
- charts

### [LinkedIn](https://docs.microsoft.com/en-au/linkedin/shared/references/v2/profile)

- information about you and your competitors

## Debugging

This app supports debugging using any of the following techniques:

- [Use a browser's developer tools](https://docs.microsoft.com/office/dev/add-ins/testing/debug-add-ins-in-office-online)
- [Attach a debugger from the task pane](https://docs.microsoft.com/office/dev/add-ins/testing/attach-debugger-from-task-pane)
- [Use F12 developer tools on Windows 10](https://docs.microsoft.com/office/dev/add-ins/testing/debug-add-ins-using-f12-developer-tools-on-windows-10)

## Additional Resources

- [Office add-in documentation](https://docs.microsoft.com/office/dev/add-ins/overview/office-add-ins)
- More Office Add-in samples at [OfficeDev on Github](https://github.com/officedev)

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
