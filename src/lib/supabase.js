import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://cylumkqhebudzifybxzz.supabase.co";
const supabaseKey = "sb_publishable_cBMebp5ierBlMnivuwHTSQ_1iuJiyu8";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
