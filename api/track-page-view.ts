import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if Supabase env variables are set
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase configuration missing');
      return res.status(500).json({ error: 'Supabase configuration missing' });
    }

    const { pagePath, pageTitle, referrer, userAgent, deviceType, browser, os, sessionId, visitorId } = req.body;

    // Get geolocation data from Vercel headers
    const country = req.headers['x-vercel-ip-country'] as string || null;
    const region = req.headers['x-vercel-ip-country-region'] as string || null;
    const city = req.headers['x-vercel-ip-city'] as string || null;

    // Decode city if present (Vercel URL-encodes it)
    const decodedCity = city ? decodeURIComponent(city) : null;

    // Dynamically import Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.from('page_views').insert({
      page_path: pagePath,
      page_title: pageTitle,
      referrer: referrer,
      user_agent: userAgent,
      device_type: deviceType,
      browser: browser,
      os: os,
      session_id: sessionId,
      visitor_id: visitorId,
      country: country,
      region: region,
      city: decodedCity,
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to track page view' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in track-page-view API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
