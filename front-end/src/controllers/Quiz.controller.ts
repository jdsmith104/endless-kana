import { useState } from 'react';
import { Kana } from '../models/kanas.model';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getRandomNumber } from '../common/shuffle';
import { Answer } from '../models/Quiz.model';

const DEFAULT_SELECTED = false;

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
    // while (randomIndeces.size < numChoices) {
    //   const index = getRandomNumber(kanas.length);
    //   randomIndeces.add(index);
    // }

    for (let index = 0; index < numChoices; index += 1) {
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

function useQuizStats() {
  const [numTries, setNumTries] = useState(0);

  function answerNotCorrect() {
    setNumTries(numTries + 1);
  }

  function answerCorrect(kana: Kana) {
    console.log(`Correctly guessed ${kana} in ${numTries} trie(0)`);
    setNumTries(0);
  }

  return {
    answerCorrect,
    answerNotCorrect,
  };
}

function selectAnswer(selectedAnswer: Answer, answers: Answer[]) {
  for (let i = 0; i < answers.length; i += 1) {
    const choice = answers[i];
    if (choice.kana.ro === selectedAnswer.kana.ro) {
      choice.selected = true;
    }
  }
}

function setAnswerButtonHighlight(kana:Kana, highlightOn: boolean): void {
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

export default useQuizStats;
export { getResetAnswersFromKana, selectAnswer, setAnswerButtonHighlight };
