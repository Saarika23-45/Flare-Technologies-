import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wponksqyiaujztyhxhrc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwb25rc3F5aWF1anp0eWh4aHJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMjgzNTQsImV4cCI6MjA5NTkwNDM1NH0.iezPTOI9HGEIPDITf4BbmpVDvuLPn7jMpu-mm4htUiA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
