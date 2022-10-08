import { IonButton } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { emptyKana, Kana } from '../common/kanas.model';
import { getRandomNumber } from '../common/shuffle';
import Question from './Question';
import AnswerContainer from './AnswerContainer';
import Notification from './Notification';
import useQuizStats, { getChoicesFromKana } from './Quiz.controller';
import QuizMode from './Quiz.model';

type QuizProps = { kanas: Kana[] };

const CHOICES_COUNT = 4;

const NOTIFICATIONS = {
  'New question': 'Try this new question',
  Retry: 'Wrong! Try something else ;)',
};

function Quiz(props: QuizProps) {
  const { kanas } = props;
  const { answerCorrect, answerNotCorrect } = useQuizStats();

  const [solution, setSolution] = useState<Kana>(emptyKana);
  const [choices, setChoices] = useState<Array<any>>([]);
  const [notification, setNotification] = useState('');
  const [mode, setMode] = useState(QuizMode.Katakana);

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

  return (
    <div>
      <Question question={solution} mode={mode} />
      <Notification notification={notification} />

      <AnswerContainer
        choices={choices}
        mode="en"
        answerClicked={{
          onClick(selected: Kana): void {
            if (selected === solution) {
              refreshQuestionAndAnswers();
              answerCorrect(selected);
            } else {
              setNotification(NOTIFICATIONS.Retry);
              answerNotCorrect();
            }
          },
        }}
      />
      <IonButton
        className="mode-toggle"
        onClick={() => {
          if (mode === QuizMode.Katakana) {
            setMode(QuizMode.Hiragana);
          } else {
            setMode(QuizMode.Katakana);
          }
        }}
      >
        Mode: {mode}
      </IonButton>
    </div>
  );
}

export default Quiz;
