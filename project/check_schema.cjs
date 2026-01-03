const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
    console.log('--- Checking Projects ---');
    const { data: p, error: pe } = await supabase.from('projects').select('*').limit(1);
    console.log('Projects table:', pe ? pe.message : 'OK (' + p.length + ' rows)');
    if (p && p[0]) console.log('Project keys:', Object.keys(p[0]));

    console.log('\n--- Checking Experience ---');
    const { data: e1, error: ee1 } = await supabase.from('experience').select('*').limit(1);
    console.log('experience (singular):', ee1 ? ee1.message : 'OK (' + e1.length + ' rows)');
    if (e1 && e1[0]) console.log('Experience keys:', Object.keys(e1[0]));

    const { data: e2, error: ee2 } = await supabase.from('experiences').select('*').limit(1);
    console.log('experiences (plural):', ee2 ? ee2.message : 'OK (' + e2.length + ' rows)');
    if (e2 && e2[0]) console.log('Experiences keys:', Object.keys(e2[0]));

    console.log('\n--- Checking About ---');
    const { data: a, error: ae } = await supabase.from('about').select('*').limit(1);
    console.log('About table:', ae ? ae.message : 'OK (' + a.length + ' rows)');
    if (a && a[0]) console.log('About keys:', Object.keys(a[0]));
}

checkSchema();
