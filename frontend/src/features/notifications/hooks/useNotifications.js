import {
  useEffect,
  useState
} from "react";

import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from "../api/notificationApi.js";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadNotifications(showLoading = false) {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setError("");

      const [
        notificationData,
        count
      ] = await Promise.all([
        getNotifications(),
        getUnreadCount()
      ]);

      setNotifications(notificationData);
      setUnreadCount(count);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load notifications"
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }

  async function markAsRead(
    notificationId
  ) {
    const updated =
      await markNotificationAsRead(
        notificationId
      );

    setNotifications((current) =>
      current.map((notification) =>
        notification._id === updated._id
          ? updated
          : notification
      )
    );

    setUnreadCount((current) =>
      Math.max(0, current - 1)
    );

    return updated;
  }

  async function markAllAsRead() {
    await markAllNotificationsAsRead();

    const readAt = new Date().toISOString();

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        isRead: true,
        readAt:
          notification.readAt || readAt
      }))
    );

    setUnreadCount(0);
  }

  useEffect(() => {
    // Initial load
    loadNotifications(true);

    // Refresh notifications every 10 seconds
    const intervalId = setInterval(() => {
      loadNotifications(false);
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    reload: loadNotifications
  };
}