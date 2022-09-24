import React, { useEffect, useState } from 'react';
import { IonButton } from '@ionic/react';
import { Kana } from '../common/kanas.model';
import { getRandomNumber } from '../common/shuffle';
import Question from './Question';
import AnswerContainer from './AnswerContainer';
import Notification from './Notification';
import getChoicesFromKana from './Quiz.controller';

type QuizProps = { kanas: Kana[] };

const CHOICES_COUNT = 4;

const NOTIFICATIONS = {
  'New question': 'Try this new question',
  Retry: 'Wrong! Try something else ;)',
};

function Quiz(props: QuizProps) {
  const { kanas } = props;

  const [solution, setSolution] = useState<Kana>();
  const [choices, setChoices] = useState<Array<any>>([]);
  const [notification, setNotification] = useState('');

  async function refreshQuestionAndAnswers() {
    const nextChoices: Kana[] = await getChoicesFromKana(kanas, CHOICES_COUNT);
    setChoices(nextChoices);
    setSolution(nextChoices[getRandomNumber(CHOICES_COUNT)]);
    setNotification(NOTIFICATIONS['New question']);
  }

  // React hook for checking when kanas (mirror of db) has been updated
  useEffect(() => {
    // Only refresh q&a when kanas available
    if (kanas.length > 0) {
      refreshQuestionAndAnswers();
    }
  }, [kanas]);

  if (solution) {
    return (
      <div>
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
      </div>
    );
  }
  return (
    <div>
      <p>Hello World!</p>
      <IonButton
        onClick={() => {
          refreshQuestionAndAnswers();
        }}
      >
        Try
      </IonButton>
    </div>
  );
}

export default Quiz;
