import { Kana } from '../common/kanas.model';
import { getRandomNumber } from '../common/shuffle';

export default async function getChoicesFromKana(
  kanas: Kana[],
  numChoices: number = 4,
): Promise<Kana[]> {
  try {
    if (kanas.length < 1) {
      throw new Error('No kana information');
    } else if (numChoices > kanas.length) {
      throw new Error('Cannot select more kana choices than available in kanas');
    }

    const nextChoices: Kana[] = [];

    const randomIndeces: Set<number> = new Set<number>();
    while (randomIndeces.size < numChoices) {
      const index = getRandomNumber(kanas.length);
      randomIndeces.add(index);
    }

    randomIndeces.forEach((index) => {
      nextChoices.push(kanas[index]);
    });

    return nextChoices;
  } catch (error) {
    return [];
  }
}
