export interface HouseUK {
  company_name: string;
  previous_company_names: CompanyName[];
  company_number: string;
  type: string;
  date_of_creation: string;
  company_status: string;
  jurisdiction: string;
  sic_codes: string[];
  last_full_members_list_date: string;
  undeliverable_registered_office_address: string;
  has_charges: string;
  has_been_liquidated: string;
  has_insolvency_history: string;
  etag: string;
  registered_office_is_in_dispute: string;
  can_file: string;
  date_retrieved: string;
  url: string;

  accounts: {
    next_due: string;
    next_made_up_to: string;
    overdue: boolean;
    next_accounts: {
      due_on: string;
      period_end_on: string;
      overdue: boolean;
      period_start_on: string;
    };
    last_accounts: {
      period_start_on: string;
      type: string;
      period_end_on: string;
      made_up_to: string;
    };
    accounting_reference_date: {
      day: string;
      month: string;
    };
  };

  registered_office_address: {
    address_line_2: string;
    postal_code: string;
    address_line_1: string;
    locality: string;
  };

  confirmation_statement: {
    next_due: string;
    next_made_up_to: string;
    overdue: boolean;
    last_made_up_to: string;
  };

  links: {
    self: string;
    filing_history: FilingHistory[];
    officers: Officer[];
    exemptions: {
      [key: string]: Exemption;
    };
    persons_with_significant_control: PersonWithSignificantControl[];
    // Yet to find a company with this data so no model as of yet
    registers: any;
  };
}

interface Officer {
  name: string;
  links: {
    officer: {
      appointments: string;
    };
  };
  address: {
    locality: string;
    premises: string;
    postal_code: string;
    address_line_1: string;
  };
  occupation: string;
  nationality: string;
  appointed_on: string;
  officer_role: string;
  date_of_birth: {
    year: number;
    month: number;
  };
  country_of_residence: string;
}

interface FilingHistory {
  category: string;
  date: string;
  description: string;
  links: {
    self: string;
    document_metadata: string;
  };
  type: string;
  pages: number;
  barcode: string;
  transaction_id: string;

  actiondate?: string;
  // Don't have a complete list of all possible objects that can appear here
  description_values?: { [key: string]: any };
  paper_filed?: boolean;
  subcategory?: string;
}

interface PersonWithSignificantControl {
  etag: string;
  kind: string;
  name: string;
  links: {
    self: string;
  };
  address: {
    country: string;
    locality: string;
    premises: string;
    address_line_1: string;
  };
  notified_on: string;
  identification: {
    legal_form: string;
    legal_authority: string;
    place_registered: string;
    country_registered: string;
    registration_number: string;
  };
  natures_of_control: string[];
}

interface Exemption {
  exemption_type: string;
  items: [
    {
      exempt_from: string;
      exempt_to: string;
    }
  ];
}

interface CompanyName {
  ceased_on: string;
  name: string;
  effective_from: string;
}

export interface HouseSearchUK {
  results: [string, string][];
}
