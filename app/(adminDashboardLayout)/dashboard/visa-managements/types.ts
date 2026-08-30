export interface VisaType {
  id: string;
  name: string;
  country: string;
  category: string;
  processingTime: string;
  requiredDocs: string[];
  eligibility: string[];
}

export interface VisaFormData {
  countryName: string;
  visaType: string;
  category: string;
  requiredDocuments: string;
  eligibility: string;
  processingTime: string;
}
