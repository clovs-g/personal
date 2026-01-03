const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function listTables() {
    console.log('Fetching tables from information_schema...');
    const { data, error } = await supabase.rpc('get_tables_info'); // If it exists
    if (error) {
        console.log('RPC failed, trying raw query via REST if possible (not really)...');
        // We can't run raw SQL easily via anon key if not exposed.
        // Let's just try several names.
        const tables = ['experience', 'experiences', 'projects', 'project', 'about', 'abouts', 'skills', 'skill'];
        for (const t of tables) {
            const { count, error: e } = await supabase.from(t).select('*', { count: 'exact', head: true });
            console.log(`Table '${t}':`, e ? e.message : `Exists (${count} rows)`);
        }
    } else {
        console.log('Tables:', data);
    }
}

listTables();
