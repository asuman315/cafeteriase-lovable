// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ypedypnxcsikqvzjqcvy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZWR5cG54Y3Npa3F2empxY3Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5MjE3NTgsImV4cCI6MjA1NjQ5Nzc1OH0.DtQCd1XP2yyToMBZc16GeEn_XweW0Ig5sNaZn6RiPm8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);