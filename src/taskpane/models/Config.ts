export interface Config {
  house: HouseConfig[];
  houseUK: HouseUKConfig[];
  linkedin: LinkedinConfig[];
  finance: FinanceConfig[];
  trends: TrendsConfig[];
}

export interface HouseConfig {
  companyName: string;
  companyNumber: number;
}

export interface HouseUKConfig {
  companyName: string;
  companyNumber: string;
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
