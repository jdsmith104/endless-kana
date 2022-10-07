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
    this.updateSize();
  }
  //
  updateSize() {
    this.size = this.length;
  }
}

const kanaCollectionName: string = 'kanasv2';

class MockFirestore {
  documentsMap: Map<string, FirestoreArray<DemoDocument>>;
  // Initialise collection to empty
  constructor(
    collectionName: string | undefined = undefined,
    documents: FirestoreArray<DemoDocument> | undefined = undefined,
  ) {
    this.documentsMap = new Map();
    // If provided set an initial db
    if (collectionName && documents) {
      documents.updateSize();
      this.set(collectionName, documents);
    }
  }

  /**
   * Set the collection at the specified path
   * @param collectionName the name of the target collection
   * @param documents the documents to be set in the collection
   */
  set(collectionName: string, documents: FirestoreArray<DemoDocument>): void {
    documents.updateSize();
    this.documentsMap.set(collectionName, documents);
  }

  reset(collectionName: string) {
    const emptyFirestore = new FirestoreArray([]);
    this.documentsMap.set(collectionName, emptyFirestore);
  }

  get(collectionName: string): FirestoreArray<DemoDocument> {
    const ret = this.documentsMap.get(collectionName);
    if (ret) {
      return ret;
    }
    return emptyFirestore;
  }

  addDoc(collectionName: string, document: DemoDocument) {
    const collection = this.documentsMap.get(collectionName);
    if (collection) {
      collection.push(document);
    } else {
      const documents: FirestoreArray = new FirestoreArray([document]);
      documents.updateSize();
      this.set(collectionName, documents);
    }
  }

  getNumDocsInCollection(collectionName: string): number {
    const collection = this.documentsMap.get(collectionName);
    if (collection) {
      return collection.length;
    }
    // Empty collection length
    return 0;
  }
}

function createDemoDocument(kana: Kana): DemoDocument {
  return new DemoDocument('', kana);
}

const exampleKanas: Kana[] = [
  {ro: 'ni', hi: 'に', ka: 'hiragana'},
  {ro: 'nu', hi: 'ぬ', ka: 'hiragana'},
  {ro: 'ne', hi: 'ね', ka: 'hiragana'},
  {ro: 'na', hi: 'な', ka: 'hiragana'},
  {ro: 'no', hi: 'の', ka: 'hiragana'},
  {ro: 're', hi: 'れ', ka: 'hiragana'},
  {ro: 'wa', hi: 'わ', ka: 'hiragana'},
  {ro: 'wo', hi: 'を', ka: 'hiragana'},
  {ro: 'me', hi: 'め', ka: 'hiragana'},
];

const exampleFirestore: FirestoreArray<DemoDocument> =
  new FirestoreArray<DemoDocument>(
    exampleKanas.map((kana) => createDemoDocument(kana)),
  );

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
      const firestoreArray = this.db.get(kanaCollectionName);
      return firestoreArray;
    } else {
      return [];
    }
  }

  add(kana: any): {id: string} {
    if (this.path == kanaCollectionName) {
      this.db.addDoc(kanaCollectionName, createDemoDocument(kana));
      return {id: (this.db.getNumDocsInCollection(kanaCollectionName)).toString()};
    } else {
      throw new Error('Selected path not valid');
    }
  }

  add_where_result(kanas: FirestoreArray) {
    const nextFirestore = new MockFirestore(kanaCollectionName, kanas);
    this.where_result_queue.push(nextFirestore);
  }

  // Designed to auto respond to query calls using pre-determined query results
  where(attr: string, operator: string, target: any): Collection {
    // Get item at front of queue
    this.where_result_queue.reverse();
    const ret = this.where_result_queue.pop();
    //ERROR HERE RETURN DOESNT CONTAIN QUEUE
    this.where_result_queue.reverse();
    if (ret) {
      // Todo: Identify if this could lead to a memory leak
      this.db = ret;
      return this;
    } else {
      throw new Error('where result not queued');
    }
  }
}

export type {DemoDocument};
export {
  exampleFirestore as exampleDocument,
  createDemoDocument,
  Collection,
  FirestoreArray,
  emptyFirestore,
  kanaCollectionName,
  MockFirestore,
};
