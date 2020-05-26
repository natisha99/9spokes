export interface House {
  DATE: string;
  NAME: string;
  INFO: {
    NZBN: {
      gst_number: string;
      website: string;
      phone_number: string;
      email_address: string;
      trading_name: string;
      trading_area: string;
      industry: string;
      abn: string;
    };
    PPSR: {};
    SUMMARY: {
      url: string;
      nzbn: string;
      entity_type: string;
      company_number: string;
      company_status: string;
      date_retrieved: string;
      ar_filing_month: string;
      company_addresses: {
        registered_office: string;
        address_for_service: string;
      };
      constitution_filed: string;
      incorporation_date: string;
      ultimateHoldingCompany: string;
    };
    ADDRESSES: {};
    DIRECTORS: { appointed_date: string; full_legal_name: string; residential_address: string }[];
    DOCUMENTS: {};
    SHAREHOLDINGS: {
      allocation: [string, [string, string][]][];
      total_number_of_shares: string;
      extensive_shareholding: string;
    };
  };
}

export interface HouseSearch {
  results: [string, number][];
}
