import type {Kana} from '../src/kanaModel';

class DemoDocument {
  id: string;
  kana: Kana;

  data(): Kana {
    return this.kana;
  }
  get(prop: string): string {
    const key = prop as keyof typeof this.kana;
    return this.kana[key];
  }

  constructor(id: string, kana: Kana) {
    this.id = id;
    this.kana = kana;
  }
}

class FirestoreArray<T = DemoDocument> extends Array<T> {
  public size: number = 0;

  constructor(items: T[]) {
    super();
    this.push(...items);
    this.size = items.length;
  }
  //
  updateSize() {
    this.size = this.length;
  }
}

const kanaCollectionName: string = 'kanasv2'

// type Mockfirestore = {'kanasv2: FirestoreArray<DemoDocument>}
// Dynamic assignment of collection path
type MockFirestore = {[p in typeof kanaCollectionName]: FirestoreArray<DemoDocument>};

function createDemoDocument(kana: Kana): DemoDocument {
  return new DemoDocument('', kana);
}

const exampleKanas = [
  {en: 'ni', jp: 'に', category: 'hiragana'},
  {en: 'nu', jp: 'ぬ', category: 'hiragana'},
  {en: 'ne', jp: 'ね', category: 'hiragana'},
  {en: 'na', jp: 'な', category: 'hiragana'},
  {en: 'no', jp: 'の', category: 'hiragana'},
  {en: 're', jp: 'れ', category: 'hiragana'},
  {en: 'wa', jp: 'わ', category: 'hiragana'},
  {en: 'wo', jp: 'を', category: 'hiragana'},
  {en: 'me', jp: 'め', category: 'hiragana'},
]
const exampleFirestore: FirestoreArray<DemoDocument> =
  new FirestoreArray<DemoDocument>(exampleKanas.map((kana)=> createDemoDocument(kana)));

const emptyFirestore: FirestoreArray = new FirestoreArray([]);

class Collection {
  path: string;
  db: MockFirestore;
  where_result_queue: Array<MockFirestore>;

  constructor(path: string, db: MockFirestore) {
    this.path = path;
    this.db = db;
    this.where_result_queue = [];
  }

  get(): Array<any> {
    if (this.path == kanaCollectionName) {
      const firestoreArray = this.db[kanaCollectionName]
      firestoreArray.updateSize();
      return this.db[this.path];
    } else {
      return [];
    }
  }

  add(kana: any): {id: number} {
    if (this.path == kanaCollectionName) {
      this.db[kanaCollectionName].push(createDemoDocument(kana));
      return {id: this.db[kanaCollectionName].length};
    } else {
      throw new Error('Selected path not valid');
    }
  }

  add_where_result(kanas: FirestoreArray) {
    this.where_result_queue.push({[kanaCollectionName]: kanas});
  }

  // Designed to auto respond to query calls using pre-determined query results
  where(attr: string, operator: string, target: any): Collection {
    // Get item at front of queue
    this.where_result_queue.reverse();
    const ret = this.where_result_queue.pop();
    //ERROR HERE RETURN DOESNT CONTAIN QUEUE
    this.where_result_queue.reverse();
    if (ret) {
      this.db = ret;
      return this;
    } else {
      throw new Error('where result not queued');
    }
  }
}

export type {DemoDocument, MockFirestore};
export {
  exampleFirestore as exampleDocument,
  createDemoDocument,
  Collection,
  FirestoreArray,
  emptyFirestore,
  kanaCollectionName
};
