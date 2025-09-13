// API client for communicating with Golang backend

interface CalculationRequest {
  expression: string;
  mode?: string;
}

interface BasicOperationRequest {
  a: number;
  b: number;
  operator: string;
}

interface ScientificOperationRequest {
  value: number;
  function: string;
  mode?: string;
}

interface CalculationResponse {
  result: number;
  original: string;
  success: boolean;
  error?: string;
}

interface ErrorResponse {
  error: string;
  code: number;
  message: string;
}

class CalculatorAPI {
  private baseURL: string;

  constructor() {
    // Use Next.js API routes for seamless integration
    this.baseURL = '/api';
  }

  // Evaluate complex mathematical expressions
  async evaluate(expression: string, mode: string = 'degree'): Promise<CalculationResponse> {
    try {
      const response = await fetch(`${this.baseURL}/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expression, mode }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Calculation failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Basic arithmetic operations
  async basicOperation(a: number, b: number, operator: string): Promise<CalculationResponse> {
    try {
      const response = await fetch(`${this.baseURL}/basic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ a, b, operator }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Operation failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Scientific mathematical functions
  async scientificOperation(value: number, functionName: string, mode: string = 'degree'): Promise<CalculationResponse> {
    try {
      const response = await fetch(`${this.baseURL}/scientific`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value, function: functionName, mode }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Scientific operation failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Get mathematical constants
  async getConstants(): Promise<{ constants: { pi: number; e: number }; success: boolean }> {
    try {
      const response = await fetch(`${this.baseURL}/constants`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error('Failed to get constants');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Convert between degrees and radians
  async convertAngle(value: number, from: string, to: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/convert-angle?value=${value}&from=${from}&to=${to}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Angle conversion failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error('Health check failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const calculatorAPI = new CalculatorAPI();

// Export types for use in components
export type {
  CalculationRequest,
  BasicOperationRequest,
  ScientificOperationRequest,
  CalculationResponse,
  ErrorResponse
};