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

import {createDemoDocument, exampleDocument} from './mockFirestore';
import type {MockFirestore} from './mockFirestore';

let myFunctions: any, adminInitStub: SinonStub, firestoreStub: SinonStub;

// Mock database
const mockDB: MockFirestore = {
  kanas: [],
};

beforeEach(() => {
  mockDB.kanas = [];
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
              if (path == 'kanas') {
                return mockDB[path];
              } else {
                return [];
              }
            },
            add: (kana: any) => {
              if (path == 'kanas') {
                mockDB['kanas'].push(createDemoDocument(kana));
                return {id: mockDB['kanas'].length};
              } else {
                return {id: 0};
              }
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
  beforeAll(() => {
    mockDB.kanas = exampleDocument;
  });

  test('It returns an error message', () => {
    const req = {headers: {origin: true}, body: {}};
    const res = {
      setHeader: (key: any, value: any) => {},
      getHeader: (value: any) => {},
      set: (val1: any, val2: any) => {},
      status: (payload: number) => {
        expect(payload).toBe(200);
      },
      json: (payload: any) => {
        expect(payload.result).toBe('Request invalid: kana not added');
      },
    };

    myFunctions.addKana(req as any, res as any);
  });

  test('It returns a success message', () => {
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
        expect(payload).toBe(200);
      },
      json: (payload: any) => {
        // If this fails, the program exits instead of failing the test
        expect(payload.result).toBe('Kana with ID: 1 added.');
      },
    };

    myFunctions.addKana(req as any, res as any);
  });

  // Todo: Test what happens when an error is thrown in API
});

describe('getKanas', () => {
  test('It returns empty', () => {
    const req = {headers: {origin: true}, body: {}};
    const res = {
      setHeader: (key: any, value: any) => {},
      getHeader: (value: any) => {},
      set: (val1: any, val2: any) => {},
      status: (payload: number) => {
        expect(payload).toBe(200);
      },
      json: (payload: any) => {
        expect(payload.result.length).toBe(0);
      },
    };

    myFunctions.getKanas(req as any, res as any);
  });

  test('It returns kanas', () => {
    mockDB.kanas = exampleDocument;

    const req = {headers: {origin: true}, body: {}};
    const res = {
      setHeader: (key: any, value: any) => {},
      getHeader: (value: any) => {},
      set: (val1: any, val2: any) => {},
      status: (payload: number) => {
        expect(payload).toBe(200);
      },
      json: (payload: any) => {
        expect(payload.result.length).toBe(9);
      },
    };

    myFunctions.getKanas(req as any, res as any);
  });

  // Todo: Test what happens when an error is thrown in API
});
