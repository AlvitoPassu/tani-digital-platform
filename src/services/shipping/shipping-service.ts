import { ShippingCost, ShippingRate } from "./types";

class ShippingServiceImpl {
  private readonly API_URL = "https://api.rajaongkir.com/starter"; // Ganti dengan API URL yang sesuai
  private readonly API_KEY = import.meta.env.VITE_RAJAONGKIR_API_KEY;

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        "key": this.API_KEY!,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getCost(params: ShippingRate): Promise<ShippingCost[]> {
    try {
      const response = await this.fetchWithAuth("/cost", {
        method: "POST",
        body: JSON.stringify({
          origin: params.origin,
          destination: params.destination,
          weight: params.weight,
          courier: params.courier.toLowerCase(),
        }),
      });

      const result = response.rajaongkir.results[0];
      return result.costs.map((cost: any) => ({
        courier: params.courier,
        service: cost.service,
        description: cost.description,
        cost: cost.cost[0].value,
        etd: cost.cost[0].etd,
      }));
    } catch (error) {
      console.error("Error fetching shipping cost:", error);
      throw error;
    }
  }

  async getJNERates(params: ShippingRate): Promise<ShippingCost[]> {
    return this.getCost({ ...params, courier: "jne" });
  }

  async getJTRates(params: ShippingRate): Promise<ShippingCost[]> {
    return this.getCost({ ...params, courier: "jnt" });
  }

  async getAllAvailableRates(params: Omit<ShippingRate, "courier">): Promise<ShippingCost[]> {
    try {
      const [jneRates, jtRates] = await Promise.all([
        this.getJNERates({ ...params, courier: "jne" }),
        this.getJTRates({ ...params, courier: "jnt" }),
      ]);

      return [...jneRates, ...jtRates].sort((a, b) => a.cost - b.cost);
    } catch (error) {
      console.error("Error fetching all rates:", error);
      throw error;
    }
  }
}

export const shippingService = new ShippingServiceImpl(); 