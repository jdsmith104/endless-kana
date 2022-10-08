import { IonButton } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { emptyKana, Kana } from '../common/kanas.model';
import { getRandomNumber } from '../common/shuffle';
import Question from './Question';
import AnswerContainer from './AnswerContainer';
import Notification from './Notification';
import useQuizStats, {
  getResetAnswersFromKana,
  selectAnswer,
} from './Quiz.controller';
import QuizMode, { Answer } from './Quiz.model';
import './Quiz.css';

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
  // Consider changing the type from Array to Map to make selectAnswer easier to read
  const [answers, setAnswers] = useState<Array<Answer>>([]);
  const [notification, setNotification] = useState('');
  const [mode, setMode] = useState(QuizMode.Katakana);

  async function refreshQuestionAndAnswers() {
    const nextAnswers: Answer[] = await getResetAnswersFromKana(
      kanas,
      CHOICES_COUNT,
    );
    setAnswers(nextAnswers);
    setSolution(nextAnswers[getRandomNumber(CHOICES_COUNT)].kana);
    setNotification(NOTIFICATIONS['New question']);
    // Reset all Asnwer things
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
        answers={answers}
        mode="en"
        answerClicked={{
          onClick(selectedAnswer: Answer): void {
            if (selectedAnswer.kana === solution) {
              refreshQuestionAndAnswers();
              answerCorrect(selectedAnswer.kana);
            } else {
              selectAnswer(selectedAnswer, answers);
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
