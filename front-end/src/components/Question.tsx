import React from 'react';
import { Kana } from '../common/kanas.model';

type QuestionProps = { question: Kana; mode: string };

function Question(props: QuestionProps) {
  const { question, mode } = props;
  let displayQuestion: string;
  if (mode === 'en') {
    displayQuestion = question.en;
  } else {
    displayQuestion = question.jp;
  }
  return <h1>What is this Kana? {displayQuestion}</h1>;
}

export default Question;
