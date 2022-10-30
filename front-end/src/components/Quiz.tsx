import { IonButton } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { emptyKana, Kana } from '../models/kanas.model';
import Question from './Question';
import AnswerContainer from './AnswerContainer';
import Notification from './Notification';
import useQuizStats, {
  QuizStats,
  refreshQuestionAndAnswers,
  selectAnswer,
  setHighlightOnAnswerButton,
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
  const quizStats: QuizStats = useQuizStats();

  const [solution, setSolution] = useState<Kana>(emptyKana);
  // Consider changing the type from Array to Map to make selectAnswer easier to read
  const [answers, setAnswers] = useState<Array<Answer>>([]);
  const [notification, setNotification] = useState('');
  const [quizMode, setQuizMode] = useState(KanaMode.Katakana);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [answerMode, setAnswerMode] = useState(KanaMode.Romanji);

  // React hook for checking when kanas (mirror of db) has been updated
  useEffect(() => {
    // Only refresh q&a when kanas available
    if (kanas.length > 0) {
      refreshQuestionAndAnswers(
        kanas,
        CHOICES_COUNT,
        setAnswers,
        setSolution,
        setNotification,
        NOTIFICATIONS['New question'],
      );
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
              setHighlightOnAnswerButton(selectedAnswer.kana, true);
              setNotification(NOTIFICATIONS['Correct answer']);

              // Instantly record stat
              quizStats.correctAnswerSelected(selectedAnswer.kana);
              // Disable button
              selectAnswer(selectedAnswer, answers);

              setTimeout(() => {
                // Enable or disable the highlight on the button
                setHighlightOnAnswerButton(selectedAnswer.kana, false);
                refreshQuestionAndAnswers(
                  kanas,
                  CHOICES_COUNT,
                  setAnswers,
                  setSolution,
                  setNotification,
                  NOTIFICATIONS['New question'],
                );
              }, correctAnswerDelayMs);
            } else {
              // Instantly record stat
              quizStats.incorrectAnswerSelected();

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
