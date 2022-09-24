import React from 'react';

type NotificationProps = { notification: string };

function Notification(props: NotificationProps) {
  const { notification } = props;
  return <p>{notification}</p>;
}

export default Notification;
