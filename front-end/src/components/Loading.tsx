import { IonSpinner } from '@ionic/react';
import '../theme/Loading.css';
import React from 'react';

const Loading = function Loading() {
  return (
    <div>
      <IonSpinner className="spinner" />
      <h1>Loading exercise...</h1>
    </div>
  );
};

export default Loading;
