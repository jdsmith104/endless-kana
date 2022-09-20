import type { Kana } from './kanas.model';

const STATUS_SUCCCESS: number = 200;

type ResponseJSON = { result: Array<Kana> };

async function getKanas(): Promise<Array<Kana>> {
  const res = await fetch(
    'https://us-central1-endless-kana.cloudfunctions.net/getKanas',
  );
  if (res.status === STATUS_SUCCCESS) {
    const data: ResponseJSON = await res.json();
    const result = data?.result as Array<Kana>;
    return result;
  }
  return [];
}

export default getKanas;
