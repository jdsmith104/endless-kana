import { IonButton } from '@ionic/react';
import React from 'react';
import { Kana } from '../common/kanas.model';

type AnswerContainerProps = {
  choices: Kana[];
  answerClicked: { onClick(kana: Kana): void };
};

function AnswerContainer(props: AnswerContainerProps) {
  const { choices, answerClicked } = props;
  return (
    <div>
      {choices.map((item) => (
        <IonButton
          key={item.en}
          onClick={() => {
            answerClicked.onClick(item);
          }}
        >
          {item.jp}
        </IonButton>
      ))}
    </div>
  );
}

export default AnswerContainer;
