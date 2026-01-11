import type { BaseApiResponse } from "~/models";
import { bufferToBase64URL } from "~/utils/helpers";

export async function registerBiometric(credential: any, userId ?: string) {
  // In a real implementation, this would send the credential to the backend
  // For now, we'll mock a successful response
  console.log('Registering biometric credential:', credential);

    const payload = {
      credentialId: credential.id,
      publicKey: credential.response.getPublicKey ? bufferToBase64URL(credential.response.getPublicKey()) : null,
      publicKeyAlgorithm: credential.response.getPublicKeyAlgorithm ? credential.response.getPublicKeyAlgorithm() : null,
      transports: credential.response.getTransports ? credential.response.getTransports() : [],
      credentialType: credential.type,
      attestationObject: bufferToBase64URL(credential.response.attestationObject),
      clientDataJSON: bufferToBase64URL(credential.response.clientDataJSON),
      userId: userId,
    };
  
  const response = await httpClient<BaseApiResponse<object>>('auth/register-pass-keys', "", {
    method: "post",
    body: payload,
  });
  
  return {
    success: response.success,
    message: response.message
  };
}
