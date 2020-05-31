import { HouseNZ, HouseSearchNZ } from "../models/HouseNZ";
import { HouseSearchUK, HouseUK } from "../models/HouseUK";
import { Finance, FinanceSearch } from "../models/Finance";
import { Trends } from "../models/Trends";
import { Linkedin, LinkedinSearch } from "../models/Linkedin";

/**
 * Fetch NZ companies matching the search query.
 * @param searchString
 * @return {HouseSearchNZ}
 */
export async function searchHouseNZ(searchString: string) {
  const output = await fetch(
    `https://projectapi.co.nz/api/nzcompaniesoffice/search/?keyword=${searchString.replace(/ /g, "+")}`
  ).then(response => response.json());
  return { results: output } as HouseSearchNZ;
}

/**
 * Fetch companies house NZ data.
 * @param companyNumber
 * @returns {HouseNZ}
 */
export async function getHouseDataNZ(companyNumber: number) {
  const output = await fetch(
    `https://projectapi.co.nz/api/nzcompaniesoffice/?company_number=${companyNumber}`
  ).then(response => response.json());
  return output as HouseNZ;
}

/**
 * Fetch UK companies matching the search query.
 * @param searchString
 * @return {HouseSearchUK}
 */
export async function searchHouseUK(searchString: string) {
  const output = await fetch(
    `https://projectapi.co.nz/api/ukcompanieshouse/search/?keyword=${searchString.replace(/ /g, "+")}`
  ).then(response => response.json());
  return { results: output } as HouseSearchUK;
}

/**
 * Fetch companies house UK data.
 * @param companyNumber
 * @returns {HouseUK}
 */
export async function getHouseDataUK(companyNumber: number) {
  const output = await fetch(
    `https://projectapi.co.nz/api/ukcompanieshouse/?company_number=${companyNumber}`
  ).then(response => response.json());
  return output.results as HouseUK;
}

/**
 * Fetch company tickers matching the search query.
 * @param searchString eg "Air New Zealand"
 * @returns {FinanceSearch}
 */
export async function searchFinance(searchString: string) {
  const output = await fetch(
    `https://projectapi.co.nz/api/yahoofinances/search/?company_name=${searchString.replace(/ /g, "+")}`
  ).then(response => response.json());
  return output as FinanceSearch;
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

/**
 * Fetch company profiles matching the search query.
 * @param searchString
 * @return {LinkedinSearch}
 */
export async function searchLinkedin(searchString: string) {
  const output = await fetch(
    `https://projectapi.co.nz/api/linkedin/search/?keyword=${searchString.replace(/ /g, "+")}`
  ).then(response => response.json());
  return output as LinkedinSearch;
}

/**
 * Fetch company profile data.
 * @param profileName
 * @returns {Linkedin}
 */
export async function getLinkedinData(profileName: string) {
  const output = await fetch(`https://projectapi.co.nz/api/linkedin/?keyword=${profileName}`).then(response =>
    response.json()
  );
  return output.results as Linkedin;
}
