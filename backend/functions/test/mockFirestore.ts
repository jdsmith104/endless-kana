/**
 * DemoDocument class
 */
class DemoDocument<T> {
  _id: string;
  _data: T;

  /**
   * Get the data in the document
   * @return T the document data
   */
  data(): T {
    return this._data;
  }

  constructor(id: string, data: T) {
    this._id = id;
    this._data = data;
  }
}

class DocumentArray<T> extends Array<T> {
  public size = 0;

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

class MockFirestore<DocType> {
  documentsMap: Map<string, DocumentArray<DemoDocument<DocType>>>;
  // Initialise collection to empty
  constructor() {
    this.documentsMap = new Map();
  }

  /**
   * Set the collection at the specified path
   * @param collectionName the name of the target collection
   * @param documents the documents to be set in the collection
   */
  set(
    collectionName: string,
    documents: DocumentArray<DemoDocument<DocType>>,
  ): void {
    documents.updateSize();
    this.documentsMap.set(collectionName, documents);
  }

  reset(collectionName: string) {
    const emptyFirestore = new DocumentArray([]);
    this.documentsMap.set(collectionName, emptyFirestore);
  }

  get(collectionName: string): DocumentArray<DemoDocument<DocType>> {
    const ret = this.documentsMap.get(collectionName);
    if (ret) {
      return ret;
    }
    return new DocumentArray<DemoDocument<DocType>>([]);
  }

  addDoc(collectionName: string, document: DemoDocument<DocType>) {
    const collection = this.documentsMap.get(collectionName);
    if (collection) {
      collection.push(document);
    } else {
      const documents: DocumentArray<DemoDocument<DocType>> = new DocumentArray([
        document,
      ]);
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

function createDemoDocument<DocType>(data: DocType): DemoDocument<DocType> {
  const doc = new DemoDocument<DocType>('', data);
  return doc;
}

class MockCollection<DocType> {
  path: string;
  db: MockFirestore<DocType>;
  where_result_queue: Array<MockFirestore<DocType>>;

  constructor(path: string, db: MockFirestore<DocType>) {
    this.path = path;
    this.db = db;
    this.where_result_queue = [];
  }

  get(): Array<any> {
    const firestoreArray = this.db.get(this.path);
    return firestoreArray;
  }

  add(data: any): {id: string} {
    this.db.addDoc(this.path, createDemoDocument(data));
    return {id: this.db.getNumDocsInCollection(this.path).toString()};
  }

  // Designed to auto respond to query calls using pre-determined query results
  where(attr: string, operator: string, target: any): MockCollection<DocType> {
    switch (operator) {
      case '==':
        const documents: DocumentArray<DemoDocument<DocType>> = this.db.get(
          this.path,
        );
        const filteredDocuments: DocumentArray<DemoDocument<DocType>> =
          new DocumentArray([]);
        documents.forEach((document) => {
          const data: DocType = document.data();
          const key = attr as keyof typeof data;
          if (key && data[key] == target) {
            filteredDocuments.push(document);
          }
        });
        this.db.set(this.path, filteredDocuments);
        break;

      default:
        throw new Error('mockFirestore: Where operator not implemented');
        break;
    }

    return this;
  }
}

export type {DemoDocument};
export {MockCollection, MockFirestore, DocumentArray, createDemoDocument};
