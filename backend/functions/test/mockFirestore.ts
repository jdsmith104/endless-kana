import {exampleKanas, Kana} from '../src/kanaModel';
import { kanaCollectionName } from './testConfig';

class DemoDocument<T=Kana> {
  _id: string;
  _data: T;

  data(): T {
    return this._data;
  }

  constructor(id: string, kana: T) {
    this._id = id;
    this._data = kana;
  }
}

class DocumentArray<T = DemoDocument> extends Array<T> {
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

class MockFirestore {
  documentsMap: Map<string, DocumentArray<DemoDocument>>;
  // Initialise collection to empty
  constructor(
    collectionName: string | undefined = undefined,
    documents: DocumentArray<DemoDocument> | undefined = undefined,
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
  set(collectionName: string, documents: DocumentArray<DemoDocument>): void {
    documents.updateSize();
    this.documentsMap.set(collectionName, documents);
  }

  reset(collectionName: string) {
    const emptyFirestore = new DocumentArray([]);
    this.documentsMap.set(collectionName, emptyFirestore);
  }

  get(collectionName: string): DocumentArray<DemoDocument> {
    const ret = this.documentsMap.get(collectionName);
    if (ret) {
      return ret;
    }
    return emptyDocumentArray;
  }

  addDoc(collectionName: string, document: DemoDocument) {
    const collection = this.documentsMap.get(collectionName);
    if (collection) {
      collection.push(document);
    } else {
      const documents: DocumentArray = new DocumentArray([document]);
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

const exampleDocumentArray: DocumentArray<DemoDocument> =
  new DocumentArray<DemoDocument>(
    exampleKanas.map((kana) => createDemoDocument(kana)),
  );

const emptyDocumentArray: DocumentArray = new DocumentArray([]);

class MockCollection {
  path: string;
  db: MockFirestore;
  where_result_queue: Array<MockFirestore>;

  constructor(path: string, db: MockFirestore) {
    this.path = path;
    this.db = db;
    this.where_result_queue = [];
  }

  get(path: string): Array<any> {
    const firestoreArray = this.db.get(this.path);
    return firestoreArray;
  }

  add(path: string, kana: any): {id: string} {
      this.db.addDoc(this.path, createDemoDocument(kana));
      return {id: (this.db.getNumDocsInCollection(this.path)).toString()};
  }

  add_where_result(kanas: DocumentArray) {
    const nextFirestore = new MockFirestore(kanaCollectionName, kanas);
    this.where_result_queue.push(nextFirestore);
  }

  // Designed to auto respond to query calls using pre-determined query results
  where(attr: string, operator: string, target: any): MockCollection {
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
  exampleDocumentArray,
  createDemoDocument,
  MockCollection,
  emptyDocumentArray,
  MockFirestore,
};
