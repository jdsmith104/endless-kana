import 'jest';
import {
  describe,
  expect,
  test,
  beforeAll,
  afterAll,
  beforeEach,
} from '@jest/globals';

const testConfig = require('firebase-functions-test')();

import * as sinon from 'sinon';
import type {SinonStub} from 'sinon';

// Require firebase-admin so we can stub out some of its methods.
import * as admin from 'firebase-admin';

import {
  Collection,
  emptyFirestore,
  exampleDocument,
  FirestoreArray,
  kanaCollectionName,
} from './mockFirestore';
import type {MockFirestore} from './mockFirestore';

let myFunctions: any, adminInitStub: SinonStub, firestoreStub: SinonStub;

// Mock database
const mockDB: MockFirestore = {
  [kanaCollectionName]: new FirestoreArray([]),
};

let collection: Collection = new Collection(kanaCollectionName, mockDB);

let expectedStatus = 200;
let expectedResult: string | number = 'Kana already exists: 0';

let actualStatus: number = NaN;
let actualResult: string | number = '';

beforeEach(() => {
  mockDB[kanaCollectionName] = new FirestoreArray([]);
  collection = new Collection(kanaCollectionName, mockDB);

  expectedStatus = NaN;
  expectedResult = '';

  actualStatus = NaN;
  actualResult = '';
});

beforeAll(() => {
  // Mock the initializeApp
  adminInitStub = sinon.stub(admin, 'initializeApp');

  // Mock the firestore
  firestoreStub = sinon.stub(admin, 'firestore').get(() => {
    return function () {
      return {
        collection: (path: string) => {
          return {
            get: (): Array<any> => {
              return collection.get();
            },
            add: (kana: any): {id: number} => {
              return collection.add(kana);
            },
            where: (attr: string, operator: string, target: any): Collection => {
              return collection.where(attr, operator, target);
            },
          };
        },
      };
    };
  });

  myFunctions = require('../src/index');
});

afterAll(() => {
  // Restore admin.initializeApp() to its original method.
  adminInitStub.restore();
  firestoreStub.restore();

  // Do other cleanup tasks.
  testConfig.cleanup();
});

describe('addKana', () => {
  beforeEach(() => {
    mockDB[kanaCollectionName] = exampleDocument;
  });

  test('It returns an error message', async () => {
    const req = {headers: {origin: true}, body: {}};
    const res = {
      setHeader: (key: any, value: any) => {},
      getHeader: (value: any) => {},
      set: (val1: any, val2: any) => {},
      status: (payload: number) => {
        actualStatus = payload;
      },
      json: (payload: any) => {
        actualResult = payload.result;
      },
    };

    collection.add_where_result(emptyFirestore);
    collection.add_where_result(emptyFirestore);

    expectedStatus = 200;
    expectedResult = 'Request invalid: kana not added';

    await myFunctions.addKana(req as any, res as any);
    expect(actualStatus).toBe(expectedStatus);
    expect(actualResult).toBe(expectedResult);
  });

  test('It returns a success message', async () => {
    const req = {
      headers: {origin: true},
      query: {en: 'hi', jp: 'ひ', category: 'hiragana'},
    };
    const res = {
      // Required for cors
      setHeader: (key: any, value: any) => {},
      getHeader: (value: any) => {},
      set: (val1: any, val2: any) => {},

      // Expected to be called in return
      status: (payload: number) => {
        actualStatus = payload;
      },
      json: (payload: any) => {
        // If this fails, the program exits instead of failing the test
        actualResult = payload.result;
      },
    };

    expectedStatus = 201;
    expectedResult = 'Kana with ID: 1 added.';

    collection.add_where_result(emptyFirestore);
    collection.add_where_result(emptyFirestore);

    await myFunctions.addKana(req as any, res as any);
    expect(actualResult).toBe(expectedResult);
    expect(actualStatus).toBe(expectedStatus);
  });

  test('It does not add duplicate kana', async () => {
    const req = {
      headers: {origin: true},
      query: {en: 'ni', jp: 'に', category: 'hiragana'},
    };

    const res = {
      // Required for cors
      setHeader: (key: any, value: any) => {},
      getHeader: (value: any) => {},
      set: (val1: any, val2: any) => {},

      // Expected to be called in return
      status: (payload: number) => {
        actualStatus = payload;
      },
      json: (payload: any) => {
        // If this fails, the program exits instead of failing the test
        actualResult = payload.result;
      },
    };

    expectedStatus = 200;
    expectedResult = 'Kana already exists: kana not added';

    collection.add_where_result(exampleDocument);
    collection.add_where_result(exampleDocument);

    await myFunctions.addKana(req as any, res as any);
    expect(actualResult).toBe(expectedResult);
    expect(actualStatus).toBe(expectedStatus);
  });

  // Todo: Test what happens when an error is thrown in API
});

describe('getKanas', () => {
  test('It returns empty', async () => {
    const req = {headers: {origin: true}, body: {}};
    const res = {
      setHeader: (key: any, value: any) => {},
      getHeader: (value: any) => {},
      set: (val1: any, val2: any) => {},
      status: (payload: number) => {
        actualStatus = payload;
      },
      json: (payload: {result: Array<any>}) => {
        actualResult = payload.result.length;
      },
    };

    expectedStatus = 200;
    expectedResult = 0;

    await myFunctions.getKanas(req as any, res as any);
    expect(actualStatus).toBe(expectedStatus);
    expect(actualResult).toBe(expectedResult);
  });

  test('It returns kanas', async () => {
    mockDB[kanaCollectionName] = exampleDocument;

    const req = {headers: {origin: true}, body: {}};
    const res = {
      setHeader: (key: any, value: any) => {},
      getHeader: (value: any) => {},
      set: (val1: any, val2: any) => {},
      status: (payload: number) => {
        actualStatus = payload;
      },
      json: (payload: any) => {
        expect(payload.result.length).toBe(9);
      },
    };

    expectedStatus = 200;

    await myFunctions.getKanas(req as any, res as any);
    expect(actualStatus).toBe(expectedStatus);
    expect(actualResult).toBe(expectedResult);
  });

  // Todo: Test what happens when an error is thrown in API
});
