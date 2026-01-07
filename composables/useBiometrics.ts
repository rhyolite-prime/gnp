export const useBiometrics = () => {
    
    // Check if platform authenticator is available
    const isBiometricsAvailable = async (): Promise<boolean> => {
        if (window.PublicKeyCredential &&
            window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
            return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        }
        return false;
    };

    // Encode string to Uint8Array
    const strToUi8 = (str: string): Uint8Array => {
        return new TextEncoder().encode(str);
    };

    // Base64Url decode to Uint8Array
    const base64UrlToUint8Array = (base64Url: string): Uint8Array => {
        const padding = '='.repeat((4 - base64Url.length % 4) % 4);
        const base64 = (base64Url + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    // Register a new credential
    const register = async (user: { id: string, email: string, name: string }) => {
        try {
            // Generate a random challenge buffer
            const challenge = new Uint8Array(32);
            window.crypto.getRandomValues(challenge);

            const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
                challenge,
                rp: {
                    name: "NewsPlus",
                    id: window.location.hostname,
                },
                user: {
                    id: strToUi8(user.id) as any, // Cast to avoid BufferSource type mismatch
                    name: user.email,
                    displayName: user.name,
                },
                pubKeyCredParams: [
                    { alg: -7, type: "public-key" }, // ES256
                    { alg: -257, type: "public-key" }, // RS256
                ],
                authenticatorSelection: {
                    authenticatorAttachment: "platform",
                    userVerification: "preferred",
                    requireResidentKey: false,
                },
                timeout: 60000,
                attestation: "direct"
            };

            const credential = await navigator.credentials.create({
                publicKey: publicKeyCredentialCreationOptions
            });

            return credential;
        } catch (error) {
            console.error("WebAuthn registration failed:", error);
            throw error;
        }
    };

    return {
        isBiometricsAvailable,
        register
    };
};
