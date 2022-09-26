import { IonContent, IonPage } from '@ionic/react';
import './Home.css';
import React, { useEffect } from 'react';
import Quiz from '../components/Quiz';
import useStorage from '../hooks/useStorage';

const Home = function Home() {
  // Constructor
  useEffect(() => {}, []);

  const { kanas } = useStorage();
  let pageContent;

  if (kanas.length > 0) {
    pageContent = <Quiz kanas={kanas} />;
  } else {
    pageContent = <h1>There has been a problem</h1>;
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <div id="page">{pageContent}</div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
