import React from 'react';
import { Kana } from '../common/kanas.model';
import './Question.css';

type QuestionProps = { question: Kana; mode: string };

function Question(props: QuestionProps) {
  const { question, mode } = props;
  let displayQuestion: string;
  if (mode === 'en') {
    displayQuestion = question.en;
  } else {
    displayQuestion = question.jp;
  }
  return (
    <div className="tile">
      <h1>{displayQuestion}</h1>
    </div>
  );
}

export default Question;
