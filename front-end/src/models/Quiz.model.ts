import { Kana } from './kanas.model';

enum QuizMode {
  Romanji = 'Romanji',
  Katakana = 'Katakana',
  Hiragana = 'Hiragana',
}

type Answer = {
  kana: Kana;
  selected: boolean;
};

export default QuizMode;
export type { Answer };
