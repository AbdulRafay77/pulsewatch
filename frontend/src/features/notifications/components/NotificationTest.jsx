import {
  useNotifications
} from "../hooks/useNotifications.js";

function NotificationTest() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>
        Notifications ({unreadCount} unread)
      </h2>

      <button
        onClick={markAllAsRead}
      >
        Mark all as read
      </button>

      {notifications.map(
        (notification) => (
          <div
            key={notification._id}
            style={{
              marginTop: "16px",
              border: "1px solid #ccc",
              padding: "12px"
            }}
          >
            <strong>
              {notification.title}
            </strong>

            <p>
              {notification.message}
            </p>

            <p>
              {notification.isRead
                ? "Read"
                : "Unread"}
            </p>

            {!notification.isRead && (
              <button
                onClick={() =>
                  markAsRead(
                    notification._id
                  )
                }
              >
                Mark as read
              </button>
            )}
          </div>
        )
      )}
    </div>
  );
}

export default NotificationTest;