import type {Kana} from '../src/kanaModel';

type DemoDocuments = {id: string; data(): Kana};

type MockFirestore = {kanas: Array<DemoDocuments>};

function createDemoDocument(kana: Kana): DemoDocuments {
  return {
    id: '',
    data: (): Kana => {
      return kana;
    },
  };
}

const exampleDocument: Array<DemoDocuments> = [
  createDemoDocument({en: 'ni', jp: 'に', category: 'hiragana'}),
  createDemoDocument({en: 'nu', jp: 'ぬ', category: 'hiragana'}),
  createDemoDocument({en: 'ne', jp: 'ね', category: 'hiragana'}),
  createDemoDocument({en: 'na', jp: 'な', category: 'hiragana'}),
  createDemoDocument({en: 'no', jp: 'の', category: 'hiragana'}),
  createDemoDocument({en: 're', jp: 'れ', category: 'hiragana'}),
  createDemoDocument({en: 'wa', jp: 'わ', category: 'hiragana'}),
  createDemoDocument({en: 'wo', jp: 'を', category: 'hiragana'}),
  createDemoDocument({en: 'me', jp: 'め', category: 'hiragana'}),
];

export type {DemoDocuments as DemoDocument, MockFirestore};
export {exampleDocument, createDemoDocument};
