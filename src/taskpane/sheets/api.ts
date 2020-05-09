/**
 * Fetch companies house NZ data.
 * @param companyNumber
 * @returns {House}
 */
export async function getHouseData(companyNumber: string) {
  const output = await fetch(`https://vladra.com/?companyNumber=${companyNumber}`).then(response => response.json());
  return output as House;
}

/**
 * Fetch Yahoo Finance data.
 * @param ticker eg "AIR.NZ"
 * @param interval similar to range
 * @param range eg "1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"
 * @returns {Finance}
 */
export async function getFinanceData(ticker: string, interval: string, range: string) {
  const output = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=${interval}&range=${range}`
  ).then(response => response.json());
  return output as Finance;
}

export async function getData(apiName: "google-trends" | "linkedin" | "facebook") {
  if (apiName == "google-trends") {
    return {
      graph: [
        ["2015-04-26", 2],
        ["2015-04-27", 3],
        ["2015-04-28", 12],
        ["2015-04-29", 5]
      ]
    };
  }

  if (apiName == "linkedin") {
    return {
      firstName: "Frodo",
      headline: "Jewelery Repossession in Middle Earth",
      id: "1R2RtA",
      lastName: "Baggins",
      siteStandardProfileRequest: {
        url: "https://www.linkedin.com/profile/view?id=…"
      }
    };
  }

  if (apiName == "facebook") {
    return {};
  }

  return undefined;
}
