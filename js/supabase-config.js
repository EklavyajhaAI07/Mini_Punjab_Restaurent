// Supabase Configuration
// Replace these with your actual Supabase project details
const SUPABASE_URL = 'https://fabfoxbqxotstxwjvofy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_JwkguB3dHTCITDd8fynxkA_gPHUKBoG';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other scripts
window.supabaseClient = supabase;
