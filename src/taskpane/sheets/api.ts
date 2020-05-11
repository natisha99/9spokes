/**
 * Fetch companies house NZ data.
 * @param companyNumber
 * @returns {House}
 */
export async function getHouseData(companyNumber: string) {
  const output = await fetch(`https://projectapi.co.nz/api/nzcompaniesoffice/?company_number=${companyNumber}`).then(response => response.json());
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
    `https://projectapi.co.nz/api/yahoofinances/?interval=${interval}&range=${range}&ticker_symbol=${ticker}`
  ).then(response => response.json());
  return output as Finance;
}

/**
 * Fetch Google trends data.
 * @param keyword search word
 * @param weeks history period
 * @returns {Trends}
 */
export async function getTrendsData(keyword: string, weeks: number) {
  const output = await fetch(
    `https://projectapi.co.nz/api/googletrends/?weeks=${weeks}&keyword=${keyword}`
  ).then(response => response.json());
  return output as Trends;
}
