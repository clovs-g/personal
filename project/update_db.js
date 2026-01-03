import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

// Manually load .env since we're running this as a standalone script
const envConfig = dotenv.parse(readFileSync('.env'));
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const newBio = `I'm an IT professional with a Bachelor's degree in Mobile Network and Service from Hope Africa University, now expanding my expertise into web development and design. My academic foundation, combined with certifications in Advanced Networking from Makerere University and Computer Networking from JRS Kampala, gives me a comprehensive technical background that I bring to every project.

My professional journey spans network administration, system configuration, and IT infrastructure management across companies in Burundi and Uganda. I've also served as a trainer at SAZIRIS Bujumbura, where I developed and delivered courses on network administration, system virtualization, and office automation - an experience that deepened my understanding of how to make technology accessible and user-friendly.

Recently, I've been channeling this technical expertise into web development, leveraging AI tools to create polished, accessible digital experiences. My training spans Microsoft Office Suite, data management tools (Kobo Collection, SINUT), and system administration, giving me insight into building solutions that are not just visually appealing but also secure, performant, and reliable.

I'm particularly passionate about the intersection of robust engineering and thoughtful design - creating interfaces that work seamlessly for diverse users. My multilingual abilities (English, French, Swahili) and cross-cultural experience position me to build inclusive digital solutions that serve global audiences.`;

const newSkills = [
    'Network Administration',
    'System Virtualization',
    'Windows Administration',
    'Graphic Design',
    'Web Design',
    'Data Management',
    'React.js',
    'Node.js (AI-Assisted)',
    'Database Design'
];

async function updateAbout() {
    console.log('Updating about table...');
    const { data, error } = await supabase
        .from('about')
        .update({
            bio: newBio,
            skills: newSkills,
            updated_at: new Date().toISOString()
        })
        .eq('id', 1)
        .select();

    if (error) {
        console.error('Error updating about:', error);

        // Try inserting if update failed (though id 1 should exist)
        console.log('Attempting insert...');
        const { error: insertError } = await supabase
            .from('about')
            .upsert({
                id: 1,
                bio: newBio,
                skills: newSkills,
                contact_info: {},
                updated_at: new Date().toISOString()
            });
        if (insertError) console.error('Insert failed:', insertError);
        else console.log('Successfully upserted about data.');
    } else {
        console.log('Successfully updated about data:', data);
    }
}

updateAbout();
