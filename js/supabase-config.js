// Supabase Configuration
// Replace these with your actual Supabase project details
const SUPABASE_URL = 'https://fabfoxbqxotstxwjvofy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_JwkguB3dHTCITDd8fynxkA_gPHUKBoG';

// Initialize the client
(function () {
    try {
        const lib = window.supabase || (window.supabaseJS ? window.supabaseJS : null);

        if (!lib) {
            console.error('Supabase library not found! Ensure the CDN script is loaded correctly.');
            return;
        }

        const client = lib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.supabaseClient = client;
        console.log('Supabase initialized successfully.');
    } catch (err) {
        console.error('Failed to initialize Supabase:', err);
    }
})();
