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

import {MockCollection, exampleDocumentArray, MockFirestore} from './mockFirestore';

import HTPPResponseStatus from '../src/httpResponseStatus';
import {kanaCollectionName} from './testConfig';

let cloudFunctions: any, adminInitStub: SinonStub, firestoreStub: SinonStub;

// Mock firestore stub
const mockDB: MockFirestore = new MockFirestore();

let collection: MockCollection;
let actualStatus: number = NaN;
let actualJSON: any = {};

function getFirestore(): any {
  return {
    collection: (path: string) => {
      collection = new MockCollection(path, mockDB);
      return collection;
    },
  };
}

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
  collection = new MockCollection(kanaCollectionName, mockDB);

  // Reset request
  req.body = {};
  req.headers = {origin: true};
  req.query = {};

  actualStatus = NaN;
  actualJSON = {};
});

beforeAll(() => {
  // Mock the initializeApp
  adminInitStub = sinon.stub(admin, 'initializeApp');

  // Mock the firestore
  firestoreStub = sinon.stub(admin, 'firestore').get(() => {
    return getFirestore;
  });

  cloudFunctions = require('../src/index');
});

afterAll(() => {
  // Restore admin.initializeApp() to its original method.
  adminInitStub.restore();
  firestoreStub.restore();
});

describe('addKana', () => {
  beforeEach(() => {
    mockDB.set(kanaCollectionName, exampleDocumentArray);
  });

  test('It returns an error message', async () => {
    const expectedStatus = HTPPResponseStatus.OK;
    const expectedResult = 'Request invalid: kana not added';

    await cloudFunctions.addKana(req as any, res as any);

    expect(actualStatus).toBe(expectedStatus);
    expect(actualJSON['result']).toBe(expectedResult);
  });

  test('It returns a success message', async () => {
    req.query = {ro: 'hi', hi: 'ひ', ka: 'ヒ'};

    const expectedStatus = HTPPResponseStatus.CREATED;
    const expectedResult = 'Kana with ID: 1 added.';

    await cloudFunctions.addKana(req as any, res as any);
    expect(actualJSON['result']).toBe(expectedResult);
    expect(actualStatus).toBe(expectedStatus);
  });

  test('It does not add duplicate kana', async () => {
    req.query = {ro: 'ni', hi: 'に', ka: 'ニ'};

    const expectedStatus = HTPPResponseStatus.OK;
    const expectedResult = 'Kana already exists: kana not added';

    await cloudFunctions.addKana(req as any, res as any);

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

    await cloudFunctions.getKanas(req as any, res as any);
    expect(actualStatus).toBe(expectedStatus);
    expect(actualJSON.result.length).toBe(expectedLength);
  });

  test('It returns kanas', async () => {
    // Set mockDB to default type
    mockDB.set(kanaCollectionName, exampleDocumentArray);

    const expectedStatus = HTPPResponseStatus.OK;
    const expectedLength = exampleDocumentArray.length;

    await cloudFunctions.getKanas(req as any, res as any);
    expect(actualStatus).toBe(expectedStatus);
    expect(actualJSON.result.length).toBe(expectedLength);
  });

  test('It handles errors', async () => {
    // Set mockDB to default type
    mockDB.set(kanaCollectionName, exampleDocumentArray);

    const expectedStatus = HTPPResponseStatus.OK;
    const expectedLength = exampleDocumentArray.length;

    await cloudFunctions.getKanas(req as any, res as any);
    expect(actualStatus).toBe(expectedStatus);
    expect(actualJSON.result.length).toBe(expectedLength);
  });

  // Todo: Test what happens when an error is thrown in API
});
