import { IonButton } from '@ionic/react';
import React from 'react';
import { Kana } from '../pages/kanas.model';

type AnswerContainerProps = {
  choices: Kana[];
  solution: Kana;
  answerClicked: { onClick(): void };
};

function AnswerContainer(props: AnswerContainerProps) {
  const { choices, solution, answerClicked } = props;
  return (
    <div>
      <h1>
        Hello, {choices[0].en} {solution.en}
      </h1>
      <IonButton
        onClick={() => {
          answerClicked.onClick();
        }}
      >
        Test
      </IonButton>
    </div>
  );
}

export default AnswerContainer;
