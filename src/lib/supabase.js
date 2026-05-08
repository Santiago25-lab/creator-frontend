import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cbejosufzuzubkwlazjb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiZWpvc3VmenV6dWJrd2xhempiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNjYyNzYsImV4cCI6MjA5Mzc0MjI3Nn0.DsSM7aHKNQslf6snj5y-Ju-ng523Fr59zxTP1UlODxI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
