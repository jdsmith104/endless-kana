import type {Kana} from '../src/kanaModel';

class DemoDocument 
{
  id: string; 
  kana: Kana;

  data(): Kana{
    return this.kana
  } 
  get(prop: string): string{
    const key = prop as keyof typeof this.kana
    return this.kana[key]
  }

  constructor(id:string, kana:Kana){
    this.id = id
    this.kana = kana
  }
};

class FirestoreArray<T=DemoDocument> extends Array<T> {
  public size: number = 0;

  constructor(items: T[]) {
    super();
    this.push(...items);
    this.size = items.length;
  }
  updateSize() {
    this.size = this.length
  } 
}

type MockFirestore = {kanas: FirestoreArray<DemoDocument>};

function createDemoDocument(kana: Kana): DemoDocument {
  return new DemoDocument('', kana)
}

const exampleDocument: FirestoreArray<DemoDocument> = new FirestoreArray<DemoDocument>([
  createDemoDocument({en: 'ni', jp: 'に', category: 'hiragana'}),
  createDemoDocument({en: 'nu', jp: 'ぬ', category: 'hiragana'}),
  createDemoDocument({en: 'ne', jp: 'ね', category: 'hiragana'}),
  createDemoDocument({en: 'na', jp: 'な', category: 'hiragana'}),
  createDemoDocument({en: 'no', jp: 'の', category: 'hiragana'}),
  createDemoDocument({en: 're', jp: 'れ', category: 'hiragana'}),
  createDemoDocument({en: 'wa', jp: 'わ', category: 'hiragana'}),
  createDemoDocument({en: 'wo', jp: 'を', category: 'hiragana'}),
  createDemoDocument({en: 'me', jp: 'め', category: 'hiragana'}),
]);


const emptyFirestore: FirestoreArray = new FirestoreArray([])


class Collection {
  path: string;
  db: MockFirestore;
  where_result_queue: Array<MockFirestore>;

  constructor(path: string, db: MockFirestore){
    this.path = path
    this.db = db
    this.where_result_queue = []
  }

  get(): Array<any> {
    if (this.path == 'kanas') {
      this.db.kanas.updateSize();
      return this.db[this.path];
    } else {
      return [];
    }
  }

  add(kana: any): {id: number} {
    if (this.path == 'kanas') {
      this.db['kanas'].push(createDemoDocument(kana));
      return {id: this.db['kanas'].length};
    } else {
      throw new Error("Selected path not valid");
      
    }
  }

  // add_where_result(kanas: Kana[]){
  //   const mockFirestore: FirestoreArray<DemoDocument> = new FirestoreArray<DemoDocument>(kanas.map(kana=> createDemoDocument(kana)))
  //   this.where_result_queue.push(new Collection(this.path, {kanas: mockFirestore}))
  // }

  add_where_result(kanas: FirestoreArray){
    this.where_result_queue.push({kanas: kanas});
  }

  where(attr: string, operator: string, target: any): Collection {
    // Get item at front of queue
    this.where_result_queue.reverse()
    const ret = this.where_result_queue.pop()
    //ERROR HERE RETURN DOESNT CONTAIN QUEUE
    this.where_result_queue.reverse()
    if (ret) {
      this.db = ret;
      return this;
    } else {
      throw new Error("where result not queued");
      
    }
  }

}

export type {DemoDocument, MockFirestore};
export {exampleDocument, createDemoDocument, Collection, FirestoreArray, emptyFirestore};
