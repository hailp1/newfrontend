// FILE: hooks/useAnalysis.ts
import { useState } from "react";

interface AnalysisError {
  message: string;
  detail?: string;
}

export function useAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AnalysisError | null>(null);

  const performAnalysis = async (analysisType: string, data: any) => {
    setLoading(true);
    setError(null);

    try {
      // Clean and format data before sending
      const cleanedData = cleanAnalysisData(data);

      const response = await fetch("/api/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysis_type: analysisType,
          data: cleanedData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      return result;
    } catch (err: any) {
      const errorObj: AnalysisError = {
        message: err.message || "Analysis failed",
        detail: err.detail || err.toString(),
      };
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to clean data before sending to backend
  const cleanAnalysisData = (data: any): any => {
    if (!data) return data;

    // Remove any undefined, null, or circular references
    const cleaned = JSON.parse(
      JSON.stringify(data, (key, value) => {
        // Remove undefined values
        if (value === undefined) return null;
        // Convert any special objects to plain objects
        if (value && typeof value === "object" && !Array.isArray(value)) {
          return { ...value };
        }
        return value;
      })
    );

    return cleaned;
  };

  return {
    loading,
    error,
    performAnalysis,
  };
}
