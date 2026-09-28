import { supabase } from "../lib/supabase";

export const fetchCurrentSeason = async () => {
  const { data, error } = await supabase
    .from("seasons")
    .select("id, description")
    .eq("is_current", true)
    .maybeSingle();

  if (error) throw error;
  return data;
};
