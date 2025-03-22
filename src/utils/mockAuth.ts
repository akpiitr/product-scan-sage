
import { User } from "@supabase/supabase-js";

export const createMockUser = (): User => {
  return {
    id: "demo-user-id",
    email: "demo@example.com",
    created_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {
      name: "Demo User",
      phone: "+1234567890",
      avatar_url: null
    },
    aud: "authenticated",
    role: null
  } as User;
};
