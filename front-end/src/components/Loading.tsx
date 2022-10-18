import { IonSpinner } from '@ionic/react';
import '../theme/Loading.css';
import React, { useEffect, useState } from 'react';
import {
  getNextMessage,
  randomiseMessages,
} from '../controllers/Loading.controller';

const LOADING_INTERVAL_MS = 6000;

const Loading = function Loading() {
  randomiseMessages();
  const [loadingMessage, setLoadingMessage] = useState(getNextMessage());

  useEffect(() => {
    // Set random message
    const intervalID = setInterval(
      () => setLoadingMessage(getNextMessage()),
      LOADING_INTERVAL_MS,
    );
    return () => {
      // Cleanup when component is removed from the UI
      clearInterval(intervalID);
    };
  }, []);

  return (
    <div>
      <IonSpinner className="spinner" />
      <h1 className="message">{loadingMessage}</h1>
    </div>
  );
};

export default Loading;
