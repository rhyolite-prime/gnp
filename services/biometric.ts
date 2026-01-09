import type { BaseApiResponse } from "~/models";

export async function registerBiometric(credential: any, userId ?: string) {
  // In a real implementation, this would send the credential to the backend
  // For now, we'll mock a successful response
  console.log('Registering biometric credential:', credential);

    const payload = {
      credentialId: credential.id,
      publicKey: credential.response.publicKey, // already base64
      publicKeyAlgorithm: credential.response.publicKeyAlgorithm,
      transports: credential.response.transports,
      credentialType: credential.type,
      attestationObject: credential.response.attestationObject,
      userId: userId,
    };
  
  const response = await httpClient<BaseApiResponse<object>>('users/register-pass-keys', "", {
    method: "post",
    body: payload,
  });
  
  return {
    success: response.success,
    message: response.message
  };
}
