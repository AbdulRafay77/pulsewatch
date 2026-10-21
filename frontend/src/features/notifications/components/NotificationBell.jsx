import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications.js";

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleOutsideClick(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    reload
  } = useNotifications();

  async function handleNotificationClick(notification) {
    if (!notification.isRead) {
      try {
        await markAsRead(notification._id);
      } catch (error) {
        console.error(
          "Failed to mark notification as read:",
          error
        );
      }
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );
    }
  }

  function handleBellClick() {
    const nextOpen = !open;

    setOpen(nextOpen);

    if (nextOpen) {
      reload(false);
    }
  }

  return (
    <div className="notification" ref={notificationRef}>
      <button
        className="notification-button"
        type="button"
        onClick={handleBellClick}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-panel">
          <div className="notification-header">
            <strong>Notifications</strong>

            {unreadCount > 0 && (
              <button
                className="notification-read-all"
                type="button"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          {loading && (
            <p className="notification-state">
              Loading notifications...
            </p>
          )}

          {error && (
            <p className="notification-error">
              {error}
            </p>
          )}

          {!loading &&
            !error &&
            notifications.length === 0 && (
              <p className="notification-state">
                You're all caught up.
              </p>
            )}

          {!loading &&
            notifications.map((notification) => {
              const monitor = notification.monitorId;

              return (
                <div
                  key={notification._id}
                  className={
                    notification.isRead
                      ? "notification-item"
                      : "notification-item notification-item-unread"
                  }
                  onClick={() =>
                    handleNotificationClick(notification)
                  }
                >
                  <div className="notification-item-header">
                    <strong>{notification.title}</strong>

                    {!notification.isRead && (
                      <span className="notification-unread-dot" />
                    )}
                  </div>

                  <p>{notification.message}</p>

                  <time>
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </time>

                  {monitor?._id && (
                    <Link
                      className="notification-monitor-link"
                      to={`/monitors/${monitor._id}`}
                      onClick={() => setOpen(false)}
                    >
                      View monitor →
                    </Link>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;