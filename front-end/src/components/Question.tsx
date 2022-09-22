import React from 'react';
import { Kana } from '../pages/kanas.model';

type QuestionProps = { question: Kana };

function Question(props: QuestionProps) {
  const { question } = props;
  return (
    <h1>
      Hello, {question.en} {question.jp}
    </h1>
  );
}

export default Question;
