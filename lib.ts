import { HfInference } from "@huggingface/inference";
import { createClient } from "@supabase/supabase-js";
export const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_API_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_API_KEY must be set");
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);
