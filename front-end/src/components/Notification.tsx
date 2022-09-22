import React from 'react';

type NotificationProps = { notification: string };

function Notification(props: NotificationProps) {
  const { notification } = props;
  return <h3>Notification: {notification}</h3>;
}

export default Notification;
