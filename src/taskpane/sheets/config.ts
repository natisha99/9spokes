import { Config, HouseConfig, LinkedinConfig, FinanceConfig, TrendsConfig } from "../models/Config";

/**
 * Returns all config data.
 * @returns {Config}
 */
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
  }).catch(function(error) {
    console.log("Error: " + error);
    if (error instanceof OfficeExtension.Error) {
      console.log("Debug info: " + JSON.stringify(error.debugInfo));
    }
  });

  return config as Config;
}

/**
 * Updates existing config values, cannot be used to add or remove items.
 * @param config updated config object.
 */
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
  }).catch(function(error) {
    console.log("Error: " + error);
    if (error instanceof OfficeExtension.Error) {
      console.log("Debug info: " + JSON.stringify(error.debugInfo));
    }
  });
}

/**
 * Adds a new item to a config table.
 * @param item
 * @param tableName
 */
function addConfig(
  item: HouseConfig | LinkedinConfig | FinanceConfig | TrendsConfig,
  tableName: "House" | "Linkedin" | "Finance" | "Trends"
) {
  Excel.run(function(context) {
    const sheet = context.workbook.worksheets.getItem("Config");
    const table = sheet.tables.getItem(tableName);
    table.rows.add(null, [[JSON.stringify(item)]]);
    return context.sync().then(function() {
      console.log(`Added item ${item} to config ${tableName}`);
    });
  }).catch(function(error) {
    console.log("Error: " + error);
    if (error instanceof OfficeExtension.Error) {
      console.log("Debug info: " + JSON.stringify(error.debugInfo));
    }
  });
}

/**
 * Removes an item from a config table by index.
 * @param index
 * @param tableName
 */
function removeConfig(index: number, tableName: "House" | "Linkedin" | "Finance" | "Trends") {
  Excel.run(function(context) {
    const sheet = context.workbook.worksheets.getItem("Config");
    const row = sheet.tables.getItem(tableName).rows.getItemAt(index);
    row.delete();
    return context.sync().then(function() {
      console.log(`Removed item at index ${index} from config ${tableName}`);
    });
  }).catch(function(error) {
    console.log("Error: " + error);
    if (error instanceof OfficeExtension.Error) {
      console.log("Debug info: " + JSON.stringify(error.debugInfo));
    }
  });
}

/**
 * Adds a new house config.
 * @param item
 */
export function addHouseConfig(item: HouseConfig) {
  addConfig(item, "House");
}

/**
 * Adds a new linkedin config.
 * @param item
 */
export function addLinkedinConfig(item: LinkedinConfig) {
  addConfig(item, "Linkedin");
}

/**
 * Adds a new finance config.
 * @param item
 */
export function addFinanceConfig(item: FinanceConfig) {
  addConfig(item, "Finance");
}

/**
 * Adds a new trends config.
 * @param item
 */
export function addTrendsConfig(item: TrendsConfig) {
  addConfig(item, "Trends");
}

/**
 * Removes a house config by index.
 * @param index
 */
export function removeHouseConfig(index: number) {
  removeConfig(index, "House");
}

/**
 * Removes a linkedin config by index.
 * @param index
 */
export function removeLinkedinConfig(index: number) {
  removeConfig(index, "Linkedin");
}

/**
 * Removes a finance config by index.
 * @param index
 */
export function removeFinanceConfig(index: number) {
  removeConfig(index, "Finance");
}

/**
 * Removes a trends config by index.
 * @param index
 */
export function removeTrendsConfig(index: number) {
  removeConfig(index, "Trends");
}
