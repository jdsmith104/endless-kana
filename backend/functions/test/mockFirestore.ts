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

class MockFirestore {
  documentsMap: Map<string, FirestoreArray<DemoDocument>>;
  // Initialise collection to empty
  constructor(collectionName: string|undefined = undefined, documents: FirestoreArray<DemoDocument>| undefined = undefined){
    this.documentsMap = new Map();
    // If provided set an initial db
    if (collectionName && documents) {
      this.set(collectionName, documents)
    }
  }

  /**
   * Set the collection at the specified path
   * @param collectionName the name of the target collection
   * @param documents the documents to be set in the collection
   */
  set(collectionName: string, documents: FirestoreArray<DemoDocument>): void{
    this.documentsMap.set(collectionName, documents)
  }

  reset(collectionName: string){
    const emptyFirestore = new FirestoreArray([])
    this.documentsMap.set(collectionName, emptyFirestore)
  }

  get(collectionName: string): FirestoreArray<DemoDocument>{
    const ret = this.documentsMap.get(collectionName);
    if (ret) {
      return ret
    }
    return emptyFirestore
    
  }

  addDoc(collectionName: string, document: DemoDocument){
    const collection = this.documentsMap.get(collectionName);
    if (collection) {
      collection.push(document)
    } else {
      this.set(collectionName, new FirestoreArray([document]))
    }
  }

  getNumDocsInCollection(collectionName: string): number{
    const collection = this.documentsMap.get(collectionName)
    if (collection) {
      return collection.length
    }
    // Empty collection length
    return 0
  }
}

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
      const firestoreArray = this.db.get(kanaCollectionName);
      // Todo: Remove this line
      firestoreArray.updateSize();
      return firestoreArray;
    } else {
      return [];
    }
  }

  add(kana: any): {id: number} {
    if (this.path == kanaCollectionName) {
      this.db.addDoc(kanaCollectionName, createDemoDocument(kana));
      return {id: this.db.getNumDocsInCollection(kanaCollectionName)};
    } else {
      throw new Error('Selected path not valid');
    }
  }

  add_where_result(kanas: FirestoreArray) {
    const nextFirestore = new MockFirestore(kanaCollectionName, kanas)
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
  MockFirestore
};
