const LOADING_MESSAGES = ['Loading...', 'Loading exercises...', 'Fetching exercises...', 'Getting exercises...'];

class CircularBuffer<T> {
  private items: T[];

  private maxSize: number;

  private nextIterator: number;

  private addIterator: number;

  constructor(initialValues: T[], maxSize: number) {
    if (initialValues.length > maxSize) {
      throw new Error('Provided more initial values than max size allows');
    }
    this.items = initialValues;
    this.maxSize = maxSize;
    this.nextIterator = 0;
    this.addIterator = 0;
  }

  add(item: T): void {
    if (this.items.length >= this.maxSize) {
      if (this.addIterator >= this.items.length) {
        this.addIterator = 0;
      }
      this.items[this.addIterator] = item;
      this.addIterator += 1;
    } else {
      this.items.push(item);
    }
  }

  clear(): void {
    this.items = [];
    this.addIterator = 0;
  }

  next(): T {
    if (this.nextIterator >= this.items.length) {
      this.nextIterator = 0;
    }
    const next = this.items[this.nextIterator];
    this.nextIterator += 1;
    return next;
  }
}

export default LOADING_MESSAGES;
export { CircularBuffer };
