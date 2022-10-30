import { IonButton } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { emptyKana, Kana } from '../models/kanas.model';
import { getRandomNumber } from '../common/shuffle';
import Question from './Question';
import AnswerContainer from './AnswerContainer';
import Notification from './Notification';
import useQuizStats, {
  getResetAnswersFromKana,
  selectAnswer,
  setAnswerButtonHighlight,
} from '../controllers/Quiz.controller';
import KanaMode, { Answer } from '../models/Quiz.model';
import '../theme/Quiz.css';

type QuizProps = { kanas: Kana[] };

const CHOICES_COUNT = 4;

const NOTIFICATIONS = {
  'New question': 'Try this new question',
  'Correct answer': 'Correct!',
  Retry: 'Wrong! Try something else ;)',
};

const correctAnswerDelayMs = 1000;

function Quiz(props: QuizProps) {
  const { kanas } = props;
  const { answerCorrect, answerNotCorrect } = useQuizStats();

  const [solution, setSolution] = useState<Kana>(emptyKana);
  // Consider changing the type from Array to Map to make selectAnswer easier to read
  const [answers, setAnswers] = useState<Array<Answer>>([]);
  const [notification, setNotification] = useState('');
  const [quizMode, setQuizMode] = useState(KanaMode.Katakana);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [answerMode, setAnswerMode] = useState(KanaMode.Romanji);

  async function refreshQuestionAndAnswers() {
    const nextAnswers: Answer[] = await getResetAnswersFromKana(
      kanas,
      CHOICES_COUNT,
    );
    setAnswers(nextAnswers);
    setSolution(nextAnswers[getRandomNumber(CHOICES_COUNT)].kana);
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
      <Question question={solution} mode={quizMode} />
      <Notification notification={notification} />

      <AnswerContainer
        answers={answers}
        mode={answerMode}
        answerClicked={{
          onClick(selectedAnswer: Answer): void {
            if (selectedAnswer.kana === solution) {
              // Highlight correct answer
              setAnswerButtonHighlight(selectedAnswer.kana, true);
              setNotification(NOTIFICATIONS['Correct answer']);

              // Instantly record stat
              answerCorrect(selectedAnswer.kana);

              // Disable button
              selectAnswer(selectedAnswer, answers);

              setTimeout(() => {
                // Enable or disable the highlight on the button
                setAnswerButtonHighlight(selectedAnswer.kana, false);
                refreshQuestionAndAnswers();
              }, correctAnswerDelayMs);
            } else {
              // Instantly record stat
              answerNotCorrect();

              setNotification(NOTIFICATIONS.Retry);

              // Disable button
              selectAnswer(selectedAnswer, answers);
            }
          },
        }}
      />
      <IonButton
        className="mode-toggle"
        onClick={() => {
          if (quizMode === KanaMode.Katakana) {
            setQuizMode(KanaMode.Hiragana);
          } else {
            setQuizMode(KanaMode.Katakana);
          }
        }}
      >
        Mode: {quizMode}
      </IonButton>
    </div>
  );
}

export default Quiz;
