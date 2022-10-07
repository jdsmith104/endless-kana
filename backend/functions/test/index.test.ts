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

import HTPPResponseStatus from '../src/httpResponseStatus';

let myFunctions: any, adminInitStub: SinonStub, firestoreStub: SinonStub;

// Mock firestore stub
const mockDB: MockFirestore = new MockFirestore();

let collection: Collection = new Collection(kanaCollectionName, mockDB);

let actualStatus: number = NaN;
let actualJSON: any;

const req = {
  headers: {origin: true},
  query: {},
  body: {},
};

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

beforeEach(() => {
  mockDB.reset(kanaCollectionName);
  collection = new Collection(kanaCollectionName, mockDB);

  // Reset request
  req.body = {};
  req.headers = {origin: true};
  req.query = {};
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
            add: (kana: any): {id: string} => {
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

describe('addKana', () => {
  beforeEach(() => {
    mockDB.set(kanaCollectionName, exampleDocument);
  });

  test('It returns an error message', async () => {
    collection.add_where_result(emptyFirestore);
    collection.add_where_result(emptyFirestore);

    const expectedStatus = HTPPResponseStatus.OK;
    const expectedResult = 'Request invalid: kana not added';

    await myFunctions.addKana(req as any, res as any);

    expect(actualStatus).toBe(expectedStatus);
    expect(actualJSON['result']).toBe(expectedResult);
  });

  test('It returns a success message', async () => {
    req.query = {ro: 'hi', hi: 'ひ', ka: 'ヒ'};

    const expectedStatus = HTPPResponseStatus.CREATED;
    const expectedResult = 'Kana with ID: 1 added.';

    collection.add_where_result(emptyFirestore);
    collection.add_where_result(emptyFirestore);

    await myFunctions.addKana(req as any, res as any);
    expect(actualJSON['result']).toBe(expectedResult);
    expect(actualStatus).toBe(expectedStatus);
  });

  test('It does not add duplicate kana', async () => {
    req.query = {ro: 'ni', hi: 'に', ka: 'ニ'};

    const expectedStatus = HTPPResponseStatus.OK;
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

    const expectedStatus = HTPPResponseStatus.OK;
    const expectedLength = 0;

    await myFunctions.getKanas(req as any, res as any);
    expect(actualStatus).toBe(expectedStatus);
    expect(actualJSON.result.length).toBe(expectedLength);
  });

  test('It returns kanas', async () => {
    // Set mockDB to default type
    mockDB.set(kanaCollectionName, exampleDocument);

    const expectedStatus = HTPPResponseStatus.OK;
    const expectedLength = exampleDocument.length;

    await myFunctions.getKanas(req as any, res as any);
    expect(actualStatus).toBe(expectedStatus);
    expect(actualJSON.result.length).toBe(expectedLength);
  });

  // Todo: Test what happens when an error is thrown in API
});
