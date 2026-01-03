import { supabase } from './supabase';

// Temporary flag to disable analytics during PostgREST schema cache issues
const ANALYTICS_ENABLED = true;

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

function getVisitorId(): string {
  let visitorId = localStorage.getItem('analytics_visitor_id');
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('analytics_visitor_id', visitorId);
  }
  return visitorId;
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Opera')) return 'Opera';
  return 'Other';
}

function getOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS')) return 'iOS';
  return 'Other';
}

export async function trackPageView(pagePath: string, pageTitle: string) {
  if (!ANALYTICS_ENABLED) return;

  try {
    await supabase
      .from('page_views')
      .insert({
        page_path: pagePath,
        page_title: pageTitle,
        referrer: document.referrer || 'direct',
        user_agent: navigator.userAgent,
        device_type: getDeviceType(),
        browser: getBrowser(),
        os: getOS(),
        session_id: getSessionId(),
        visitor_id: getVisitorId(),
      });
  } catch (error) {
    // Silently fail - analytics should not break the user experience
  }
}

export async function trackProjectView(projectId: string) {
  if (!ANALYTICS_ENABLED) return;

  try {
    await supabase
      .from('project_views')
      .insert({
        project_id: projectId,
        session_id: getSessionId(),
        visitor_id: getVisitorId(),
      });
  } catch (error) {
    // Silently fail - analytics should not break the user experience
  }
}

export async function submitContactMessage(name: string, email: string, message: string) {
  try {
    const { error } = await supabase
      .from('messages')
      .insert([{
        name,
        email,
        message,
        status: 'new'
      }]);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Analytics: Failed to submit contact message:', error);
    return { success: false, error };
  }
}

export const analyticsService = {
  async getPageViewStats(days: number = 30) {
    if (!ANALYTICS_ENABLED) return [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('page_views')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getTotalPageViews(days: number = 30) {
    if (!ANALYTICS_ENABLED) return 0;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { count, error } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString());

    if (error) throw error;
    return count || 0;
  },

  async getUniqueVisitors(days: number = 30) {
    if (!ANALYTICS_ENABLED) return 0;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('page_views')
      .select('visitor_id')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;
    const uniqueVisitors = new Set(data?.map(v => v.visitor_id));
    return uniqueVisitors.size;
  },

  async getProjectViewStats() {
    if (!ANALYTICS_ENABLED) return [];

    const { data, error } = await supabase
      .from('project_views')
      .select('project_id, projects(title)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getTotalProjectViews(days: number = 30) {
    if (!ANALYTICS_ENABLED) return 0;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { count, error } = await supabase
      .from('project_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString());

    if (error) throw error;
    return count || 0;
  },

  async getContactMessages(status?: string) {
    if (!ANALYTICS_ENABLED) return [];

    let query = supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getUnreadMessagesCount() {
    if (!ANALYTICS_ENABLED) return 0;

    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');

    if (error) throw error;
    return count || 0;
  },

  async getDeviceAnalytics(days: number = 30) {
    if (!ANALYTICS_ENABLED) return {};

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('page_views')
      .select('device_type')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const deviceCounts = data?.reduce((acc: any, curr) => {
      acc[curr.device_type] = (acc[curr.device_type] || 0) + 1;
      return acc;
    }, {});

    return deviceCounts || {};
  },

  async getRecentActivity(limit: number = 10) {
    if (!ANALYTICS_ENABLED) return [];

    const { data, error } = await supabase
      .from('page_views')
      .select('page_path, page_title, device_type, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },
};
