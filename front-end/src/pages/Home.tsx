import { IonButton, IonContent, IonPage } from '@ionic/react';
import './Home.css';
import React, { useEffect, useState } from 'react';
import { Kana } from '../common/kanas.model';
import Question from '../components/Question';
import AnswerContainer from '../components/AnswerContainer';
import Notification from '../components/Notification';
import useStorage from '../hooks/useStorage';
import { getRandomNumber } from '../common/shuffle';

const NOTIFICATIONS = {
  'New question': 'Try this new question',
  Retry: 'Wrong! Try something else ;)',
};

const CHOICES_COUNT = 4;

const Home = function Home() {
  const { kanas } = useStorage();

  const [solution, setSolution] = useState<Kana | undefined>(undefined);
  const [choices, setChoices] = useState<Array<any>>([]);
  const [notification, setNotification] = useState('');

  async function refreshQuestionAndAnswers() {
    async function getChoices(numChoices: number = 4): Promise<Kana[]> {
      try {
        if (kanas.length < 1) {
          throw new Error('No kana information');
        } else if (numChoices > kanas.length) {
          throw new Error('Cannot select more kana choices than available in kanas');
        }

        const nextChoices: Kana[] = [];

        const randomIndeces: Set<number> = new Set<number>();
        while (randomIndeces.size < numChoices) {
          const index = getRandomNumber(kanas.length);
          randomIndeces.add(index);
        }

        randomIndeces.forEach((index) => {
          nextChoices.push(kanas[index]);
        });

        return nextChoices;
      } catch (error) {
        return [];
      }
    }

    const nextChoices: Kana[] = await getChoices(CHOICES_COUNT);
    setChoices(nextChoices);
    setSolution(nextChoices[getRandomNumber(CHOICES_COUNT)]);
    setNotification(NOTIFICATIONS['New question']);
  }

  // Constructor
  useEffect(() => {}, []);

  // React hook for checking when kanas (mirror of db) has been updated
  useEffect(() => {
    // Only refresh q&a when kanas available
    if (kanas.length > 0) {
      refreshQuestionAndAnswers();
    }
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
