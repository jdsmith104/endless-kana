import * as functions from 'firebase-functions';
import type {Request, Response} from 'firebase-functions';
import type {QueryDocumentSnapshot} from 'firebase-functions/v1/firestore';
import {ParsedQs} from 'qs';
import type {Kana} from './kanaModel';

// The Firebase Admin SDK to access Firestore.
import {db} from './config/firebase';

const SUCCESS_STATUS = 200;
const FAIL_STATUS = 500;

// POST request to add a valid kana to database
exports.addKana = functions.https.onRequest(async (req: Request, res: Response) => {
  try {
    res.set('Access-Control-Allow-Origin', '*');
    // Todo: Check request type
    if (isValidQuery(req.query)) {
      // Do Kana procesing
      const kana: Kana = req.query as unknown as Kana;
      const writeResult = await db.collection('kanas').add(kana);
      res.status(SUCCESS_STATUS);
      const id: unknown = writeResult.id;
      res.json({result: `Kana with ID: ${id} added.`});
    } else {
      res.status(SUCCESS_STATUS);
      res.json({
        result: 'Request invalid: kana not added',
      });
    }
  } catch (error: unknown) {
    res.status(FAIL_STATUS);
    res.json('Unable to add kana');
  }
});

// GET request get all Kanas
exports.getKanas = functions.https.onRequest(async (req: Request, res: Response) => {
  try {
    res.set('Access-Control-Allow-Origin', '*');
    // Todo: Check request type
    // Get database snapshot
    const querySnapshot: FirebaseFirestore.QuerySnapshot = await db
      .collection('kanas')
      .get();

    const kanas: unknown[] = [];

    querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
      // doc.data() is never undefined for query doc snapshots
      kanas.push(doc.data());
    });

    res.status(SUCCESS_STATUS);
    res.json({result: kanas});
  } catch (error: unknown) {
    res.status(FAIL_STATUS);
    res.json('Unable to get kanas');
  }
});

/**
 * Represents a book.
 * @constructor
 * @param {ParsedQs} query - The query
 */
function isValidQuery(query: ParsedQs): boolean {
  // Rejects non-truthy value in any parameter
  if (query && query.en && query.jp && query.category) {
    return true;
  }
  return false;
}
