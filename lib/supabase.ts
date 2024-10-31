// import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://dmsocybvdzdzafpemybt.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtc29jeWJ2ZHpkemFmcGVteWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU2MTcwMzYsImV4cCI6MjA0MTE5MzAzNn0.j0uZXo4szp3pfnZmutyc7n8fjP2BpXCI_FLihoizDW4"
)


// USED TO MAKE CLAUDIO SIDE OF THE CODE WORK

// import { createClient } from "@supabase/supabase-js";

// export const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// )