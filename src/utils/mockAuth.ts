
import { User } from "firebase/auth";

export const createMockUser = (): User => {
  return {
    uid: "demo-user-id",
    email: "demo@example.com",
    displayName: "Demo User",
    phoneNumber: "+1234567890",
    emailVerified: true,
    isAnonymous: false,
    photoURL: null,
    providerData: [],
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString(),
    },
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => "demo-token",
    getIdTokenResult: async () => ({
      token: "demo-token",
      signInProvider: "demo",
      expirationTime: new Date(Date.now() + 3600000).toISOString(),
      issuedAtTime: new Date().toISOString(),
      claims: {},
      authTime: new Date().toISOString(),
    }),
    reload: async () => {},
    toJSON: () => ({})
  } as User;
};
