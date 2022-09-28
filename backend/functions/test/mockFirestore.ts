import type {Kana} from '../src/kanaModel';

type DemoDocuments = {id: string; data(): Kana};

class FirestoreArray<T=DemoDocuments> extends Array<T> { 
  constructor(items: T[]) {
    super();
    this.push(...items);
  }

  size = (): number => {
    return this.length;
  }


}

type MockFirestore = {kanas: FirestoreArray<DemoDocuments>};

function createDemoDocument(kana: Kana): DemoDocuments {
  return {
    id: '',
    data: (): Kana => {
      return kana;
    },
  };
}

const exampleDocument: FirestoreArray<DemoDocuments> = new FirestoreArray<DemoDocuments>([
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


class Collection {
  path: string;
  db: MockFirestore;

  constructor(path: string, db: MockFirestore){
    this.path = path
    this.db = db
  }

  get(): Array<any> {
    if (this.path == 'kanas') {
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
      return {id: 0};
    }
  }

  where(attr: string, operator: string, target: any): Collection {
      
    
    const newDb: MockFirestore = this.db
    if (newDb.kanas.length > 0) {
    switch (operator) {
      case "==":{
        const a = newDb.kanas[0].data()
      const key = attr as keyof typeof newDb.kanas[0];
      newDb.kanas.filter((val)=>{
        val.data()[key] == target})
      return new Collection(this.path, newDb);}
      default:
        throw new Error("Operator not implemented");
        break;
    }
  } else {
    return new Collection(this.path, newDb);
  }

}}

export type {DemoDocuments as DemoDocument, MockFirestore};
export {exampleDocument, createDemoDocument, Collection, FirestoreArray};
