export interface Config {
  house: HouseConfig[];
  linkedin: LinkedinConfig[];
  finance: FinanceConfig[];
  trends: TrendsConfig[];
}

export interface HouseConfig {
  companyNumber: string;
}

export interface LinkedinConfig {}

export interface FinanceConfig {
  ticker: string;
  interval: string;
  range: string;
}

export interface TrendsConfig {
  keyword: string;
  weeks: number;
}
