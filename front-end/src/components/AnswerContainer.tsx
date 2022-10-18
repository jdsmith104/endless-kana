import { IonButton } from '@ionic/react';
import React from 'react';
import '../theme/AnswerContainer.css';
import KanaMode, { Answer } from '../models/Quiz.model';

type AnswerContainerProps = {
  answers: Answer[];
  mode: KanaMode;
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
          {mode === KanaMode.Romanji && item.kana.ro}
          {mode === KanaMode.Hiragana && item.kana.hi}
          {mode === KanaMode.Katakana && item.kana.ka}
        </IonButton>
      ))}
    </div>
  );
}

export default AnswerContainer;
