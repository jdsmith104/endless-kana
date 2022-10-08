import React from 'react';
import { Kana } from '../common/kanas.model';
import './Question.css';
import QuizMode from './Quiz.model';

type QuestionProps = { question: Kana; mode: QuizMode };

function Question(props: QuestionProps) {
  const { question, mode } = props;
  let displayQuestion: string;
  if (mode === QuizMode.Romanji) {
    displayQuestion = question.ro;
  } else if (mode === QuizMode.Katakana) {
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
