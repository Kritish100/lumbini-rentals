export interface PublicProperty {
  id: string;
  title: string;
  price: number;
  type: string;
  location: string;
  subLocation: string;
  category: string[];
  status: string;
  description: string;
  isNegotiable: boolean;
  isOfferActive: boolean;
  offerDescription: string;
  specifications: Record<string, string> | null;
  assets: string[];
  createdAt: string;
}
