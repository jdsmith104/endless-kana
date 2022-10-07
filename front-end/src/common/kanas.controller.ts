import type { Kana } from './kanas.model';

const STATUS_SUCCCESS: number = 200;

type ResponseJSON = { result: Array<Kana> };

const defaultKanas = [
  { ro: 'ni', hi: 'に', ka: '?' },
  { ro: 'nu', hi: 'ぬ', ka: '?' },
  { ro: 'ne', hi: 'ね', ka: '?' },
  { ro: 'na', hi: 'な', ka: '?' },
  { ro: 'no', hi: 'の', ka: '?' },
  { ro: 're', hi: 'れ', ka: '?' },
  { ro: 'wa', hi: 'わ', ka: '?' },
  { ro: 'wo', hi: 'を', ka: '?' },
  { ro: 'me', hi: 'め', ka: '?' },
];

async function getKanas(): Promise<Array<Kana>> {
  try {
    const res = await fetch(
      'https://us-central1-endless-kana.cloudfunctions.net/getKanas',
    );
    let kanas: Kana[];
    if (res.status === STATUS_SUCCCESS) {
      const data: ResponseJSON = await res.json();
      const result = data?.result as Array<Kana>;
      kanas = result;
    } else {
      kanas = defaultKanas;
    }
    return kanas;
  } catch (error) {
    return defaultKanas;
  }
}

export default getKanas;
