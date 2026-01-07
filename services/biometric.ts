import type { BaseApiResponse } from "~/models";

export async function registerBiometric(credential: any) {
  // In a real implementation, this would send the credential to the backend
  // For now, we'll mock a successful response
  console.log('Registering biometric credential:', credential);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock response
  return {
    success: true,
    message: "Biometric registered successfully"
  };
}
