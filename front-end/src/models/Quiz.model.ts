import { Kana } from './kanas.model';

enum KanaMode {
  Romanji = 'Romanji',
  Katakana = 'Katakana',
  Hiragana = 'Hiragana',
}

type Answer = {
  kana: Kana;
  selected: boolean;
};

export default KanaMode;
export type { Answer };
