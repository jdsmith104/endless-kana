import { IonButton } from '@ionic/react';
import React from 'react';
import { Kana } from '../common/kanas.model';
import './AnswerContainer.css';

type AnswerContainerProps = {
  choices: Kana[];
  mode: string;
  answerClicked: { onClick(kana: Kana): void };
};

function AnswerContainer(props: AnswerContainerProps) {
  const { choices, mode, answerClicked } = props;
  return (
    <div className="container">
      {choices.map((item) => (
        <IonButton
          key={item.ro}
          onClick={() => {
            answerClicked.onClick(item);
          }}
        >
          {mode === 'en' && item.ro}
          {mode !== 'en' && item.hi}
        </IonButton>
      ))}
    </div>
  );
}

export default AnswerContainer;
