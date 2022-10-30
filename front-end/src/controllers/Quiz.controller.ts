import { useState } from 'react';
import { Kana } from '../models/kanas.model';
import { getRandomNumber } from '../common/shuffle';
import { Answer } from '../models/Quiz.model';

const DEFAULT_SELECTED = false;

interface QuizStats {
  correctAnswerSelected: (kana: Kana) => void;
  incorrectAnswerSelected: () => void;
}

async function getResetAnswersFromKana(
  kanas: Kana[],
  numChoices: number = 4,
): Promise<Answer[]> {
  try {
    if (kanas.length < 1) {
      throw new Error('No kana information');
    } else if (numChoices > kanas.length) {
      throw new Error('Cannot select more kana choices than available in kanas');
    }

    const nextChoices: Answer[] = [];

    const randomIndeces: Set<number> = new Set<number>();
    while (randomIndeces.size < numChoices) {
      const index = getRandomNumber(kanas.length);
      randomIndeces.add(index);
    }

    randomIndeces.forEach((index) => {
      nextChoices.push({ kana: kanas[index], selected: DEFAULT_SELECTED });
    });

    return nextChoices;
  } catch (error) {
    return [];
  }
}
function useQuizStats(): QuizStats {
  const [numTries, setNumTries] = useState(0);

  function incorrectAnswerSelected() {
    setNumTries(numTries + 1);
  }

  function correctAnswerSelected(kana: Kana) {
    console.log(`Correctly guessed ${kana} in ${numTries} trie(0)`);
    setNumTries(0);
  }

  return { correctAnswerSelected, incorrectAnswerSelected };
}

function selectAnswer(selectedAnswer: Answer, answers: Answer[]) {
  for (let i = 0; i < answers.length; i += 1) {
    const choice = answers[i];
    if (choice.kana.ro === selectedAnswer.kana.ro) {
      choice.selected = true;
    }
  }
}

function setHighlightOnAnswerButton(kana: Kana, highlightOn: boolean): void {
  const element = document.getElementById(kana.ro);
  let backgroundColour: string;
  if (element) {
    if (highlightOn) {
      backgroundColour = 'var(--custom-secondary';
    } else {
      backgroundColour = 'var(--custom-accent)';
    }
    element.style.setProperty('--background', backgroundColour);
  }
}

/**
 * Refresh questions and answers using setters supplied as arguments
 * @param kanas
 * @param numAnswers
 * @param setAnswers
 * @param setSolution
 * @param setNotification
 * @param notification
 */
async function refreshQuestionAndAnswers(
  kanas: Kana[],
  numAnswers: number,
  setAnswers: Function,
  setSolution: Function,
  setNotification: Function,
  notification: string,
): Promise<void> {
  const nextAnswers: Answer[] = await getResetAnswersFromKana(kanas, numAnswers);
  setAnswers(nextAnswers);
  setSolution(nextAnswers[getRandomNumber(numAnswers)].kana);
  setNotification(notification);
}

export default useQuizStats;
export { selectAnswer, setHighlightOnAnswerButton, refreshQuestionAndAnswers };
export type { QuizStats };
