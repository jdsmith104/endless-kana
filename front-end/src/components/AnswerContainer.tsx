import { IonButton } from '@ionic/react';
import React from 'react';
import './AnswerContainer.css';
import { Answer } from './Quiz.model';

type AnswerContainerProps = {
  answers: Answer[];
  mode: string;
  answerClicked: { onClick(answer: Answer): void };
};

function AnswerContainer(props: AnswerContainerProps) {
  const { answers, mode, answerClicked } = props;
  return (
    <div className="container">
      {answers.map((item) => (
        <IonButton
          key={item.kana.ro}
          onClick={() => {
            answerClicked.onClick(item);
          }}
          disabled={item.selected}
        >
          {mode === 'en' && item.kana.ro}
          {mode !== 'en' && item.kana.hi}
        </IonButton>
      ))}
    </div>
  );
}

export default AnswerContainer;
