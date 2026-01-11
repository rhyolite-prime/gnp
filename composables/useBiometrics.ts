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
                    id: strToUi8(user.id) as any,
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

    // Authenticate with a credential
    const authenticate = async (challengeBuffer: Uint8Array) => {
        try {
            const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
                challenge: challengeBuffer as any,
                timeout: 60000,
                rpId: window.location.hostname,
                userVerification: "preferred",
            };

            const credential = await navigator.credentials.get({
                publicKey: publicKeyCredentialRequestOptions
            });

            return credential;
        } catch (error) {
            console.error("WebAuthn authentication failed:", error);
            throw error;
        }
    };

    // ArrayBuffer to Base64Url
    const bufferToBase64Url = (buffer: ArrayBuffer): string => {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    };

    return {
        isBiometricsAvailable,
        register,
        authenticate,
        bufferToBase64Url
    };
};
