const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://your-tunnel-url.trycloudflare.com";

// Generic API call function với timeout và error handling tốt hơn
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API Error (${response.status}): ${errorText || response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new Error("Request timeout: Backend server is not responding");
    }

    if (error instanceof TypeError) {
      throw new Error(
        "Network error: Cannot connect to backend server. Make sure Python backend is running on port 8000."
      );
    }

    throw error;
  }
}

// API service functions
export const analysisAPI = {
  // Cronbach's Alpha
  calculateCronbachAlpha: (data: any) =>
    apiCall<any>("/api/v1/calculate/cronbach-alpha", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // VIF Analysis
  calculateVIF: (data: any) =>
    apiCall<any>("/api/v1/calculate/vif", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // T-Test
  calculateTTest: (data: any) =>
    apiCall<any>("/api/v1/calculate/t-test", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // ANOVA
  calculateANOVA: (data: any) =>
    apiCall<any>("/api/v1/calculate/anova", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // EFA
  calculateEFA: (data: any) =>
    apiCall<any>("/api/v1/calculate/efa", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
