export interface Config {
  house: HouseConfig[];
  linkedin: LinkedinConfig[];
  finance: FinanceConfig[];
  trends: TrendsConfig[];
}

export interface HouseConfig {
  companyName: string;
  companyNumber: number;
}

export interface LinkedinConfig {
  profileName: string;
}

export interface FinanceConfig {
  ticker: string;
  interval: string;
  range: string;
}

export interface TrendsConfig {
  keyword: string;
  weeks: number;
}
