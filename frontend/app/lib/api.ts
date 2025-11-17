import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async validateShipment(data: any) {
    try {
      const response = await this.client.post('/agent/validate', data);
      return response.data;
    } catch (error) {
      throw new Error(`Validation failed: ${error}`);
    }
  }

  async getQuotes(data: any) {
    try {
      const response = await this.client.post('/multimodal/quote', data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get quotes: ${error}`);
    }
  }

  async getRecommendations(data: any) {
    try {
      const response = await this.client.post('/agent/recommend', data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get recommendations: ${error}`);
    }
  }
}

export const apiClient = new ApiClient();
