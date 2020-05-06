class House {
  DATE: string;
  NAME: string;
  INFO: {
    NZBN: {};
    PPSR: {};
    SUMMARY: {
      nzbn: string;
      entity_type: string;
      company_number: string;
      company_status: string;
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
