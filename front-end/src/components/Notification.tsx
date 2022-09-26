import React from 'react';
import './Notification.css';

type NotificationProps = { notification: string };

function Notification(props: NotificationProps) {
  const { notification } = props;
  return (
    <div className="notification-container">
      <p>{notification}</p>
    </div>
  );
}

export default Notification;
