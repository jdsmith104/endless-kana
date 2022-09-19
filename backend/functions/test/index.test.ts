import 'jest';
import {expect, test, beforeAll, afterAll} from '@jest/globals';

const testConfig = require('firebase-functions-test')();

import * as sinon from 'sinon';
import type {SinonStub} from 'sinon';

// Require firebase-admin so we can stub out some of its methods.
import * as admin from 'firebase-admin';

import type {Kana} from '../src/kanaModel';

let myFunctions: any, adminInitStub: SinonStub, firestoreStub: SinonStub;

type MockDB = {kanas: Array<Kana>};

// Mock database
const mockDB: MockDB = {
  kanas: [
    {en: 'ni', jp: 'に', category: 'hiragana'},
    {en: 'nu', jp: 'ぬ', category: 'hiragana'},
    {en: 'ne', jp: 'ね', category: 'hiragana'},
    {en: 'na', jp: 'な', category: 'hiragana'},
    {en: 'no', jp: 'の', category: 'hiragana'},
    {en: 're', jp: 'れ', category: 'hiragana'},
    {en: 'wa', jp: 'わ', category: 'hiragana'},
    {en: 'wo', jp: 'を', category: 'hiragana'},
    {en: 'me', jp: 'め', category: 'hiragana'},
  ],
};

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
            add: (doc: any) => {
              if (path == 'kanas') {
                mockDB[path].push(doc);
                return {id: mockDB[path].length};
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
  test('It returns an error message', () => {
    const req = {headers: {origin: true}, body: {}};
    const res = {
      setHeader: (key: any, value: any) => {},
      getHeader: (value: any) => {},
      status: (payload: number) => {
        expect(payload).toBe(400);
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

      // Expected to be called in return
      status: (payload: number) => {
        expect(payload).toBe(400);
      },
      json: (payload: any) => {
        // If this fails, the program exits instead of failing the test
        expect(payload.result).toBe('Kana with ID: 10 added.');
      },
    };

    myFunctions.addKana(req as any, res as any);
  });
});
