export interface ShipmentDetails {
  shipmentTypes: string[];
  weight: number;
  weightUnit: 'kg' | 'tons';
  volume: number;
  commodity: string;
  hsCode: string;
  hazardous: boolean;
  temperatureControlled: boolean;
  origin: string;
  destination: string;
  departureWindow: string;
  incoterms: string;
  customsClearance: boolean;
  insurance: boolean;
  lastMileDelivery: boolean;
  warehousing: boolean;
}

export interface TransportLeg {
  mode: string;
  origin: string;
  destination: string;
  duration: string;
  carrier?: string;
}

export interface ShippingOption {
  mode: string;
  price: number;
  transitDays: number;
  route: TransportLeg[];
  carbonFootprint?: number;
  reliability?: number;
}

export interface QuoteResponse {
  cheapest: ShippingOption;
  fastest: ShippingOption;
  bestValue: ShippingOption;
  options: ShippingOption[];
  aiSummary: string;
  requestId: string;
}
