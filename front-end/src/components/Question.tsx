import React from 'react';
import { Kana } from '../models/kanas.model';
import '../theme/Question.css';
import KanaMode from '../models/Quiz.model';

type QuestionProps = { question: Kana; mode: KanaMode };

function Question(props: QuestionProps) {
  const { question, mode } = props;
  let displayQuestion: string;
  if (mode === KanaMode.Romanji) {
    displayQuestion = question.ro;
  } else if (mode === KanaMode.Katakana) {
    displayQuestion = question.ka;
  } else {
    displayQuestion = question.hi;
  }
  return (
    <div className="tile">
      <h1>{displayQuestion}</h1>
    </div>
  );
}

export default Question;
