export interface ShippingOrigin {
  cityId: string;
  cityName: string;
  provinceId: string;
  provinceName: string;
}

export interface ShippingDestination {
  cityId: string;
  cityName: string;
  provinceId: string;
  provinceName: string;
}

export interface ShippingCost {
  courier: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export interface ShippingService {
  code: string;
  name: string;
  costs: {
    service: string;
    description: string;
    cost: {
      value: number;
      etd: string;
      note: string;
    }[];
  }[];
}

export interface ShippingRate {
  origin: string;
  destination: string;
  weight: number;
  courier: string;
} 