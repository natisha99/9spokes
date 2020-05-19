import { Config } from "../models/Config";

export async function loadConfig() {
  let config;
  await Excel.run(function(context) {
    const sheet = context.workbook.worksheets.getItem("Config");
    const house = sheet.tables.getItem("House").rows.load();
    const linkedin = sheet.tables.getItem("Linkedin").rows.load();
    const finance = sheet.tables.getItem("Finance").rows.load();
    const trends = sheet.tables.getItem("Trends").rows.load();
    return context.sync().then(function() {
      config = {
        house: house.items.reduce((prev, cur) => [...prev, JSON.parse(cur.values[0][0])], []),
        linkedin: linkedin.items.reduce((prev, cur) => [...prev, JSON.parse(cur.values[0][0])], []),
        finance: finance.items.reduce((prev, cur) => [...prev, JSON.parse(cur.values[0][0])], []),
        trends: trends.items.reduce((prev, cur) => [...prev, JSON.parse(cur.values[0][0])], [])
      };
      console.log("Loaded Config");
    });
  });

  return config as Config;
}

export function saveConfig(config: Config) {
  Excel.run(function(context) {
    const sheet = context.workbook.worksheets.getItem("Config");
    const house = sheet.tables.getItem("House").rows.load();
    const linkedin = sheet.tables.getItem("Linkedin").rows.load();
    const finance = sheet.tables.getItem("Finance").rows.load();
    const trends = sheet.tables.getItem("Trends").rows.load();
    return context.sync().then(function() {
      config.house.forEach((item, index) => (house.items[index].values = [[JSON.stringify(item)]]));
      config.linkedin.forEach((item, index) => (linkedin.items[index].values = [[JSON.stringify(item)]]));
      config.finance.forEach((item, index) => (finance.items[index].values = [[JSON.stringify(item)]]));
      config.trends.forEach((item, index) => (trends.items[index].values = [[JSON.stringify(item)]]));
      console.log("Saved Config");
    });
  });
}
