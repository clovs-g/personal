import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Users,
  Eye,
  MessageSquare,
  Calendar,
  Globe,
  Smartphone
} from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import Card from '../../components/UI/Card';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { analyticsService } from '../../lib/analytics';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import MessageModal from '../../components/admin/MessageModal';

interface Activity {
  page_path: string;
  page_title: string;
  device_type: string;
  created_at: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const { isDark } = useThemeStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalViews: 0,
    uniqueVisitors: 0,
    projectViews: 0,
    contactMessages: 0
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deviceStats, setDeviceStats] = useState({
    desktop: 0,
    mobile: 0,
    tablet: 0
  });

  useEffect(() => {
    loadAnalytics();

    // specific channel for dashboard updates
    const channel = supabase
      .channel('dashboard-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'page_views' },
        () => {
          loadAnalytics();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'project_views' },
        () => {
          loadAnalytics();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        () => {
          loadAnalytics();
          toast.success('New message received!');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadAnalytics = async () => {
    try {
      // Don't set loading to true on refresh to avoid flickering
      if (messages.length === 0) setLoading(true);

      const [totalViews, uniqueVisitors, projectViews, unreadCount, devices, activity, msgsList] = await Promise.all([
        analyticsService.getTotalPageViews(30),
        analyticsService.getUniqueVisitors(30),
        analyticsService.getTotalProjectViews(30),
        analyticsService.getUnreadMessagesCount(),
        analyticsService.getDeviceAnalytics(30),
        analyticsService.getRecentActivity(10),
        analyticsService.getContactMessages()
      ]);

      setStats({
        totalViews,
        uniqueVisitors,
        projectViews,
        contactMessages: unreadCount
      });

      const total = (devices.desktop || 0) + (devices.mobile || 0) + (devices.tablet || 0);
      setDeviceStats({
        desktop: total > 0 ? Math.round((devices.desktop || 0) / total * 100) : 0,
        mobile: total > 0 ? Math.round((devices.mobile || 0) / total * 100) : 0,
        tablet: total > 0 ? Math.round((devices.tablet || 0) / total * 100) : 0
      });

      setRecentActivities(activity || []);
      setMessages(msgsList || []);
    } catch (error) {
      console.error('Error loading analytics:', error);
      // toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = async (message: Message) => {
    setSelectedMessage(message);

    if (message.status === 'new') {
      try {
        const { error } = await supabase
          .from('messages')
          .update({ status: 'read' })
          .eq('id', message.id);

        if (error) throw error;

        // Update local state to reflect change immediately
        setMessages(prev => prev.map(m =>
          m.id === message.id ? { ...m, status: 'read' } : m
        ));

        // Update stats (unread count)
        setStats(prev => ({
          ...prev,
          contactMessages: Math.max(0, prev.contactMessages - 1)
        }));

        // Update the selected message status in the modal
        setSelectedMessage(prev => prev ? { ...prev, status: 'read' } : null);

      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const handleStatClick = (title: string) => {
    let targetId = '';

    switch (title) {
      case 'Total Page Views':
      case 'Project Views':
        targetId = 'recent-activity-section';
        break;
      case 'Unique Visitors':
        targetId = 'device-analytics-section';
        break;
      case 'Contact Messages':
        targetId = 'messages-section';
        break;
    }

    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const statCards = [
    {
      title: 'Total Page Views',
      value: stats.totalViews.toLocaleString(),
      change: 'Last 30 days',
      changeType: 'neutral',
      icon: Eye,
      color: 'blue'
    },
    {
      title: 'Unique Visitors',
      value: stats.uniqueVisitors.toLocaleString(),
      change: 'Last 30 days',
      changeType: 'neutral',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Project Views',
      value: stats.projectViews.toLocaleString(),
      change: 'Last 30 days',
      changeType: 'neutral',
      icon: BarChart,
      color: 'purple'
    },
    {
      title: 'Contact Messages',
      value: stats.contactMessages.toString(),
      change: 'Unread messages',
      changeType: 'neutral',
      icon: MessageSquare,
      color: 'orange'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Dashboard
        </h1>
        <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Welcome back! Here's what's happening with your portfolio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => handleStatClick(stat.title)}
            className="cursor-pointer"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' :
                  stat.color === 'green' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' :
                    stat.color === 'purple' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400' :
                      'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400'
                  }`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          id="recent-activity-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-6 h-full">
            <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className={`text-sm text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  No recent activity yet. Visitors will appear here once they start browsing your portfolio.
                </p>
              ) : (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${activity.device_type === 'mobile' ? 'bg-green-500' :
                      activity.device_type === 'tablet' ? 'bg-purple-500' :
                        'bg-blue-500'
                      }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {activity.page_title || activity.page_path} visited from {activity.device_type}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {getTimeAgo(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* Device Stats */}
        <motion.div
          id="device-analytics-section"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="p-6 h-full">
            <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Device Analytics
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Desktop
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${deviceStats.desktop}%` }}
                    />
                  </div>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {deviceStats.desktop}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Mobile
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${deviceStats.mobile}%` }}
                    />
                  </div>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {deviceStats.mobile}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tablet
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${deviceStats.tablet}%` }}
                    />
                  </div>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {deviceStats.tablet}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Messages Section */}
      <motion.div
        id="messages-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="p-6">
          <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Recent Messages
          </h2>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <p className={`text-sm text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No messages yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className={`pb-3 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Name</th>
                      <th className={`pb-3 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Email</th>
                      <th className={`pb-3 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Message</th>
                      <th className={`pb-3 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Date</th>
                      <th className={`pb-3 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {messages.map((msg) => (
                      <tr
                        key={msg.id}
                        onClick={() => handleMessageClick(msg)}
                        className={`group cursor-pointer transition-colors ${isDark
                          ? 'hover:bg-gray-800/50'
                          : 'hover:bg-gray-50'
                          } ${msg.status === 'new'
                            ? isDark ? 'bg-blue-500/5' : 'bg-blue-50'
                            : ''
                          }`}
                      >
                        <td className={`py-4 pr-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{msg.name}</td>
                        <td className={`py-4 pr-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{msg.email}</td>
                        <td className={`py-4 pr-4 ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-xs truncate`}>{msg.message}</td>
                        <td className={`py-4 pr-4 ${isDark ? 'text-gray-400' : 'text-gray-500'} whitespace-nowrap`}>
                          {new Date(msg.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${msg.status === 'new'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}>
                            {msg.status === 'new' ? 'New' : 'Read'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      <MessageModal
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        message={selectedMessage}
      />
    </div>
  );
};

export default Dashboard;