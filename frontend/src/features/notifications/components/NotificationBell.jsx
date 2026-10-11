import { useState } from "react";
import { Link } from "react-router-dom";

import {
  useNotifications
} from "../hooks/useNotifications.js";

function NotificationBell() {
  const [open, setOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead
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

  return (
    <div
      style={{
        position: "relative"
      }}
    >
      <button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
        }
        style={{
          position: "relative",
          cursor: "pointer",
          fontSize: "20px"
        }}
        aria-label="Notifications"
      >
        🔔

        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              minWidth: "18px",
              height: "18px",
              borderRadius: "10px",
              background: "red",
              color: "white",
              fontSize: "11px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px"
            }}
          >
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "40px",
            width: "360px",
            maxHeight: "450px",
            overflowY: "auto",
            background: "white",
            color: "black",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "12px",
            zIndex: 1000,
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.15)"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px"
            }}
          >
            <strong>
              Notifications
            </strong>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={
                  handleMarkAllAsRead
                }
              >
                Mark all as read
              </button>
            )}
          </div>

          {loading && (
            <p>
              Loading notifications...
            </p>
          )}

          {error && (
            <p>{error}</p>
          )}

          {!loading &&
            !error &&
            notifications.length === 0 && (
              <p>
                No notifications yet.
              </p>
            )}

          {!loading &&
            notifications.map(
              (notification) => {
                const monitor =
                  notification.monitorId;

                return (
                  <div
                    key={notification._id}
                    onClick={() =>
                      handleNotificationClick(
                        notification
                      )
                    }
                    style={{
                      padding: "12px",
                      marginBottom: "8px",
                      borderRadius: "6px",
                      background:
                        notification.isRead
                          ? "#f7f7f7"
                          : "#eef4ff",
                      cursor: "pointer"
                    }}
                  >
                    <div>
                      <strong>
                        {notification.title}
                      </strong>

                      <span
                        style={{
                          marginLeft: "8px",
                          fontSize: "12px",
                          fontWeight: "600"
                        }}
                      >
                        {notification.isRead
                          ? "Read"
                          : "Unread"}
                      </span>
                    </div>

                    <p
                      style={{
                        margin:
                          "6px 0"
                      }}
                    >
                      {notification.message}
                    </p>

                    <small>
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </small>

                    {monitor?._id && (
                      <div
                        style={{
                          marginTop:
                            "8px"
                        }}
                      >
                        <Link
                          to={`/monitors/${monitor._id}`}
                          onClick={() =>
                            setOpen(false)
                          }
                        >
                          View monitor
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }
            )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;