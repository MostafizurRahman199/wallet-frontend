export const debugApiResponse = (data: any, label: string = "API Response") => {
  console.log(`=== ${label} ===`);
  console.log("Full Response:", data);
  console.log("Response Data:", data?.data);
  console.log("Response Stats:", data?.data?.stats);
  console.log("Keys in data:", Object.keys(data?.data || {}));
  console.log("Keys in stats:", Object.keys(data?.data?.stats || {}));
};
