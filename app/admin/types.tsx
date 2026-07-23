export interface DynamicField {
  id: string;
  key: string;
  value: string;
  keyType: 'preset' | 'custom'
}

export interface AdminProperty {
  id: string;
  title: string;
  price: number;
  type: string;
  location: string;
  subLocation: string;
  mapsUrl: string;
  longitude: string;
  latitude: string;
  category: string[];
  status: string;
  description: string;
  isNegotiable: boolean;
  isArchived: boolean;
  isActiveOffer: boolean;
  offerDescription: string;
  ownerName: string;
  ownerContact: string;
  specifications: Record<string, string> | null;
  assets: string[];
  createdAt: string;
}