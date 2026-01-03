const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkProjects() {
    console.log('--- Checking Projects Table ---');
    const { data, error, count } = await supabase
        .from('projects')
        .select('*', { count: 'exact' });

    if (error) {
        console.error('Error fetching projects:', error);
    } else {
        console.log(`Successfully fetched ${count} projects.`);
        console.log('Projects:', JSON.stringify(data, null, 2));
    }
}

checkProjects();
