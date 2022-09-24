export default function fisherYates<T>(arr: T[]): T[] {
  const arrCopy: T[] = [...arr];
  let currentIndex = arrCopy.length;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    const tmp = arrCopy[currentIndex];

    // eslint-disable-next-line no-param-reassign
    arrCopy[currentIndex] = arrCopy[randomIndex];
    // eslint-disable-next-line no-param-reassign
    arrCopy[randomIndex] = tmp;
  }

  return arrCopy;
}
