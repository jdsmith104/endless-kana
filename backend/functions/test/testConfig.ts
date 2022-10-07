import {exampleKanas, Kana} from '../src/kanaModel';
import {
  createDemoDocument,
  DemoDocument,
  DocumentArray,
} from '../test/mockFirestore';

export const kanaCollectionName: string = 'kanasv2';

export const exampleDocumentArray: DocumentArray<DemoDocument<Kana>> =
  new DocumentArray<DemoDocument<Kana>>(
    exampleKanas.map((kana) => createDemoDocument<Kana>(kana)),
  );

export const emptyDocumentArray: DocumentArray<DemoDocument<any>> =
  new DocumentArray([]);
