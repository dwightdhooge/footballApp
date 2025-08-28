export interface SvgResponse {
  success: boolean;
  data?: string;
  error?: string;
}

export const fetchSvg = async (svgUrl: string): Promise<SvgResponse> => {
  try {
    const response = await fetch(svgUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const svgData = await response.text();

    if (!svgData || svgData.trim() === "") {
      throw new Error("Empty SVG data received");
    }

    return {
      success: true,
      data: svgData,
    };
  } catch (error) {
    console.error("Error fetching SVG:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
