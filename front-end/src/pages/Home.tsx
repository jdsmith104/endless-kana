import { IonButton, IonContent, IonPage } from '@ionic/react';
import './Home.css';
import React, { useEffect, useState } from 'react';
import { Kana } from '../common/kanas.model';
import Question from '../components/Question';
import AnswerContainer from '../components/AnswerContainer';
import Notification from '../components/Notification';
import useStorage from '../hooks/useStorage';

const NOTIFICATIONS = {
  'New question': 'Try this new question',
  Retry: 'Wrong! Try something else ;)',
};

const Home = function Home() {
  const { kanas } = useStorage();

  const [solution, setSolution] = useState<Kana | undefined>(undefined);
  const [choices, setChoices] = useState<Array<any>>([]);
  const [notification, setNotification] = useState('');

  async function start() {
    if (kanas) {
      setSolution(kanas[0]);
      setChoices(kanas.slice(0, 4));
      setNotification('Pick an answer');
    }
  }

  async function refreshQuestionAndAnswers() {
    async function getChoices(numChoices: number = 4): Promise<Kana[]> {
      try {
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

    const nextChoices: Kana[] = await getChoices();
    setChoices(nextChoices);
    setSolution(nextChoices[0]);
    setNotification(NOTIFICATIONS['New question']);
  }

  useEffect(() => {
    start();
  }, []);

  // React hook for checking when kanas (mirror of db) has been updated
  useEffect(() => {
    console.log('State Kanas has been updated', kanas);
    refreshQuestionAndAnswers();
  }, [kanas]);

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
        <IonButton
          onClick={() => {
            refreshQuestionAndAnswers();
          }}
        >
          Try
        </IonButton>
      </IonContent>
    );
  }

  return <IonPage>{content}</IonPage>;
};

export default Home;
