export type TUser = {
  id: string;
  name: string;
  email: string;
  profilePicture?: string | null;
  role: "USER" | "ADMIN";
  subscriptionType?: string;
  subscriptionStatus?: string;
  country?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type LoginResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    result: {
      accessToken: string;
      refreshToken: string;
    };
  };
};

export type RegisterResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: TUser;
};

export type GetMeResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: TUser;
};export type TVisaType = {
  id: string;
  destinationCountry: string;
  name: string;
  category: string;
  processingTime: string;
  requiredDocs: string[];
  eligibility: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type GetVisaResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
      totalVisaTypes: number;
    };
    data: TVisaType[];
  };
};

export type GetSingleVisaResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: TVisaType;
};

export type GetUsersResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  stats: {
    totalUser: number;
    newUser: number;
  };
  data: TUser[];
};


export type TSubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  billingPeriod: "FREE" | "MONTHLY" | "ONE_TIME" | "YEARLY" | "WEEKLY";
  description: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
};

export type GetSubscriptionPlansResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: TSubscriptionPlan[];
};

export type GetSingleSubscriptionPlanResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: TSubscriptionPlan;
};

export type TTransitRule = {
  id: string;
  travelerCountry: string;
  transitCountry: string;
  requirement: "REQUIRED" | "NOT_REQUIRED" | "CONDITIONAL";
  maxLayoverDuration: string;
  conditions: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type GetTransitRulesResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  stats: {
    totalRules: number;
    requiredCount: number;
    freeVisaCount: number;
    conditionalCount: number;
  };
  data: TTransitRule[];
};

export type TCountryPolicy = {
  id: string;
  travelerCountry: string;
  destinationCountry: string;
  travelPurpose: string;
  visaOutcome: string;
  status: string;
  visaType: string;
  maxStayDuration: string;
  notesConditions: string;
  createdAt: string;
  updatedAt: string;
};

export type GetCountryPoliciesResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  stats: {
    exceptionsDefined: number;
    countriesInExceptions: number;
    defaultPolicyCoverage: number;
  };
  data: TCountryPolicy[];
};

export type CreateCountryPolicyResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: TCountryPolicy;
};

export type GetSingleCountryPolicyResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: TCountryPolicy;
};

export type UpdateCountryPolicyResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: TCountryPolicy;
};
export type TAirport = {
  icao: string;
  iata: string;
  name: string;
  city: string;
  country: string;
};

export type GetAirportsResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    data: TAirport[];
    query: string;
  };
};
export type TTravelPattern = {
  title: string;
  transitRegions: string[];
  estimatedDuration: string;
  typicalConnections: string;
  connectionCount: number;
};

export type GetAirportRoutesResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    route: {
      from: {
        code: string;
        city: string;
        country: string;
      };
      to: {
        code: string;
        city: string;
        country: string;
      };
    };
    travelPatterns: TTravelPattern[];
  };
};
export type TAiHistory = {
  id: string;
  userId: string;
  originAirport: string;
  originCity: string;
  originCountry: string;
  destinationAirport: string;
  destinationCity: string;
  destinationCountry: string;
  visaType: string;
  routeTitle: string;
  transitRegions: string[];
  estimatedDuration: string;
  connectionCount: number;
  aiResponse: {
    visaOverview: {
      summary: string;
      notes: string[];
    };
    transitLogic: {
      summary: string;
      riskLevel: string;
      notes: string[];
    };
    routeFeasibility: {
      rating: string;
      advantages: string[];
      concerns: string[];
    };
    travelAdvice: string[];
    documentationTips: string[];
    weatherComparison: {
      destinationClimate: string;
      preparationTips: string[];
    };
    overallAssessment: {
      feasibility: string;
      confidenceScore: number;
      finalNote: string;
    };
  };
  confidenceScore: number;
  createdAt: string;
};

export type GetAiHistoryResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: TAiHistory[];
};

export type GetSingleAiHistoryResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: TAiHistory;
};
export type TRecentActivity = {
  id: string;
  title: string;
  description: string;
  color: string;
  createdAt: string;
  timeAgo: string;
};

export type TDashboardSummary = {
  totalCountries: number;
  visaTypes: number;
  travelRoutes: number;
  activeUsers: number;
  recentActivities: TRecentActivity[];
};

export type GetDashboardSummaryResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: TDashboardSummary;
};

export type GetRecentActivitiesResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: TRecentActivity[];
};
