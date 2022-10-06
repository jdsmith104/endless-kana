import 'jest';
import {
  describe,
  expect,
  test,
  beforeAll,
  afterAll,
  beforeEach,
} from '@jest/globals';

import * as sinon from 'sinon';
import type {SinonStub} from 'sinon';

// Require firebase-admin so we can stub out some of its methods.
import * as admin from 'firebase-admin';

import {
  Collection,
  emptyFirestore,
  exampleDocument,
  kanaCollectionName,
  MockFirestore,
} from './mockFirestore';

let myFunctions: any, adminInitStub: SinonStub, firestoreStub: SinonStub;

// Mock firestore stub
const mockDB: MockFirestore = new MockFirestore();

let collection: Collection = new Collection(kanaCollectionName, mockDB);

let actualStatus: number = NaN;
let actualJSON: any;

beforeEach(() => {
  mockDB.reset(kanaCollectionName);
  collection = new Collection(kanaCollectionName, mockDB);

  actualStatus = NaN;
  actualJSON = '';
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
});

const res = {
  // Required for cors
  setHeader: (key: any, value: any) => {},
  getHeader: (value: any) => {},
  set: (val1: any, val2: any) => {},

  // Expected to be called in return
  status: (status: number) => {
    actualStatus = status;
  },
  json: (json: any) => {
    // If this fails, the program exits instead of failing the test
    actualJSON = json;
  },
};

describe('addKana', () => {
  beforeEach(() => {
    mockDB.set(kanaCollectionName, exampleDocument);
  });

  test('It returns an error message', async () => {
    const req = {headers: {origin: true}, body: {}};

    collection.add_where_result(emptyFirestore);
    collection.add_where_result(emptyFirestore);

    const expectedStatus = 200;
    const expectedResult = 'Request invalid: kana not added';

    await myFunctions.addKana(req as any, res as any);

    expect(actualStatus).toBe(expectedStatus);
    expect(actualJSON['result']).toBe(expectedResult);
  });

  test('It returns a success message', async () => {
    const req = {
      headers: {origin: true},
      query: {en: 'hi', jp: 'ひ', category: 'hiragana'},
    };

    const expectedStatus = 201;
    const expectedResult = 'Kana with ID: 1 added.';

    collection.add_where_result(emptyFirestore);
    collection.add_where_result(emptyFirestore);

    await myFunctions.addKana(req as any, res as any);
    expect(actualJSON['result']).toBe(expectedResult);
    expect(actualStatus).toBe(expectedStatus);
  });

  test('It does not add duplicate kana', async () => {
    const req = {
      headers: {origin: true},
      query: {en: 'ni', jp: 'に', category: 'hiragana'},
    };

    const expectedStatus = 200;
    const expectedResult = 'Kana already exists: kana not added';

    // Set where query results
    collection.add_where_result(exampleDocument);
    collection.add_where_result(exampleDocument);

    await myFunctions.addKana(req as any, res as any);

    expect(actualJSON['result']).toBe(expectedResult);
    expect(actualStatus).toBe(expectedStatus);
  });

  // Todo: Test what happens when an error is thrown in API
});

describe('getKanas', () => {
  test('It returns empty', async () => {
    // Reset DB
    mockDB.reset(kanaCollectionName);

    const req = {headers: {origin: true}, body: {}};

    const expectedStatus = 200;
    const expectedLength = 0;

    await myFunctions.getKanas(req as any, res as any);
    expect(actualStatus).toBe(expectedStatus);
    expect(actualJSON.result.length).toBe(expectedLength);
  });

  test('It returns kanas', async () => {
    // Set mockDB to default type
    mockDB.set(kanaCollectionName, exampleDocument);

    const req = {headers: {origin: true}, body: {}};

    const expectedStatus = 200;
    const expectedLength = exampleDocument.length;

    await myFunctions.getKanas(req as any, res as any);
    expect(actualStatus).toBe(expectedStatus);
    expect(actualJSON.result.length).toBe(expectedLength);
  });

  // Todo: Test what happens when an error is thrown in API
});
