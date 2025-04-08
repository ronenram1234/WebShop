export interface Stock {
  _id?: string;
  id?: string;
  Brand: string;
  Model: string;
  SKU: string;
  Description: string;
  "Price (USD)": string;
  Condition: string;
  Location: string;
  Status: string;
  createdAt?: string;
  isFavorite?: boolean;
  inCart?: boolean;
  requestedQuota?: number;
  quotaRequestDate?: string;
  quotaHandled?: boolean;
  inCartBy?: Array<{
    userId: string;
    name: {
      first: string;
      last: string;
    };
    email: string;
    createdAt: string;
    quantity: number;
    requestedQuota?: number;
    quotaRequestDate?: string;
    quotaHandled?: boolean;
  }>;
}
