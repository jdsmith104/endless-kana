import type { Kana } from './kanas.model';

const STATUS_SUCCCESS: number = 200;

type ResponseJSON = { result: Array<Kana> };

const defaultKanas = [
  { en: 'ni', jp: 'に', category: 'hiragana' },
  { en: 'nu', jp: 'ぬ', category: 'hiragana' },
  { en: 'ne', jp: 'ね', category: 'hiragana' },
  { en: 'na', jp: 'な', category: 'hiragana' },
  { en: 'no', jp: 'の', category: 'hiragana' },
  { en: 're', jp: 'れ', category: 'hiragana' },
  { en: 'wa', jp: 'わ', category: 'hiragana' },
  { en: 'wo', jp: 'を', category: 'hiragana' },
  { en: 'me', jp: 'め', category: 'hiragana' },
];

async function getKanas(): Promise<Array<Kana>> {
  try {
    const res = await fetch(
      'https://us-central1-endless-kana.cloudfunctions.net/getKanas',
    );
    if (res.status === STATUS_SUCCCESS) {
      const data: ResponseJSON = await res.json();
      const result = data?.result as Array<Kana>;
      return result;
    }
    return defaultKanas;
  } catch (error) {
    return defaultKanas;
  }
}

export default getKanas;
