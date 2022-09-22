import { IonContent, IonPage } from '@ionic/react';
import './Home.css';
import React, { useEffect, useState } from 'react';
import getKanas from './kanas.controller';
import { Kana } from './kanas.model';
import Question from '../components/Question';
import AnswerContainer from '../components/AnswerContainer';
import Notification from '../components/Notification';

const NOTIFICATIONS = {
  'New question': 'Try this new question',
  Retry: 'Wrong! Try something else ;)',
};

const Home = function Home() {
  const [solution, setSolution] = useState<Kana | undefined>(undefined);
  const [choices, setChoices] = useState<Array<any>>([]);
  const [notification, setNotification] = useState('');

  async function start() {
    const kanas = await getKanas();
    if (kanas) {
      setSolution(kanas[0]);
      setChoices(kanas.slice(0, 4));
      setNotification('Pick an answer');
    }
  }

  function refreshQuestionAndAnswers() {
    async function getChoices(numChoices: number = 4): Promise<Kana[]> {
      try {
        const kanas = await getKanas();
        const initialIndex = Math.floor(Math.random() * kanas.length);
        const nextChoices: Kana[] = [];
        let offset = initialIndex;
        while (nextChoices.length < numChoices) {
          if (offset >= kanas.length) {
            offset = 0;
          }
          nextChoices.push(kanas[offset]);
          offset += 1;
        }
        return nextChoices;
      } catch (error) {
        return [];
      }
    }

    console.log('Refreshing...');
    getChoices().then((newChoices) => {
      setChoices(newChoices);
      setSolution(newChoices[0]);
      setNotification(NOTIFICATIONS['New question']);
    });
  }

  useEffect(() => {
    start();
  }, []);
  let content;

  if (solution) {
    content = (
      <IonContent fullscreen>
        <Question question={solution} />
        <Notification notification={notification} />

        <AnswerContainer
          choices={choices}
          answerClicked={{
            onClick(answerSelected: Kana): void {
              if (answerSelected === solution) {
                console.log('Solution found');
                refreshQuestionAndAnswers();
              } else {
                console.log('Solution not found');
                setNotification(NOTIFICATIONS.Retry);
              }
            },
          }}
        />
      </IonContent>
    );
  } else {
    content = (
      <IonContent fullscreen>
        <p>Hello World!</p>
      </IonContent>
    );
  }

  return <IonPage>{content}</IonPage>;
};

export default Home;
