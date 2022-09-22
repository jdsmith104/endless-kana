import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import React, { useEffect, useState } from 'react';
import getKanas from './kanas.controller';
import { Kana } from './kanas.model';
import Question from '../components/Question';

const Home = function Home() {
  const [solution, setSolution] = useState<Kana | undefined>(undefined);
  const [choices, setChoices] = useState<Array<any>>([]);
  const [notification, setNotification] = useState('');

  let kanas: Array<Kana> = [];

  async function start() {
    kanas = await getKanas();
    console.log(kanas);
    if (kanas) {
      setSolution(kanas[0]);
      setChoices(kanas.slice(0, 4));
      setNotification('Pick an answer');
      console.log(solution, choices, notification);
    }
  }

  useEffect(() => {
    start();
  }, []);
  let content;

  if (solution) {
    content = (
      <IonContent fullscreen>
        <Question question={solution} />
        <p>{solution?.category}</p>
        <p>{notification}</p>
        <div>
          {choices.map((item) => (
            <p key={item.en}>{item.jp}</p>
          ))}
        </div>
      </IonContent>
    );
  } else {
    content = (
      <IonContent>
        <p>Hello World!</p>
      </IonContent>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      {content}
    </IonPage>
  );
};

export default Home;
