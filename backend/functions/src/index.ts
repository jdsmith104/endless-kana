import * as functions from 'firebase-functions';
import type {Request, Response} from 'firebase-functions';
import type {QueryDocumentSnapshot} from 'firebase-functions/v1/firestore';
import {ParsedQs} from 'qs';
import type {Kana} from './kanaModel';

// The Firebase Admin SDK to access Firestore.
import {db} from './config/firebase';
import HTPPResponseStatus from './httpResponseStatus';

const kanaCollectionName = 'kanasv2';

// POST request to add a valid kana to database
exports.addKana = functions.https.onRequest(async (req: Request, res: Response) => {
  try {
    res.set('Access-Control-Allow-Origin', '*');
    // Todo: Check request type
    if (isValidQuery(req.query)) {
      // Do Kana procesing
      const kana: Kana = req.query as unknown as Kana;
      const kanaInCollection: boolean = await isKanaInCollection(kana);
      if (!kanaInCollection) {
        const writeResult = await db.collection(kanaCollectionName).add(kana);
        res.status(HTPPResponseStatus.CREATED);
        const id: unknown = writeResult.id;
        res.json({result: `Kana with ID: ${id} added.`});
      } else {
        res.status(HTPPResponseStatus.OK);
        res.json({
          result: 'Kana already exists: kana not added',
        });
      }
    } else {
      res.status(HTPPResponseStatus.OK);
      res.json({
        result: 'Request invalid: kana not added',
      });
    }
  } catch (error: unknown) {
    res.status(HTPPResponseStatus.FAILED);
    res.json({result: 'Unable to add kana'});
  }
});

// GET request get all Kanas
exports.getKanas = functions.https.onRequest(async (req: Request, res: Response) => {
  try {
    res.set('Access-Control-Allow-Origin', '*');
    // Todo: Check request type
    // Get database snapshot
    const querySnapshot: FirebaseFirestore.QuerySnapshot = await db
      .collection(kanaCollectionName)
      .get();

    const kanas: unknown[] = [];

    querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
      // doc.data() is never undefined for query doc snapshots
      kanas.push(doc.data());
    });

    res.status(HTPPResponseStatus.OK);
    res.json({result: kanas});
  } catch (error: unknown) {
    res.status(HTPPResponseStatus.FAILED);
    res.json({result: 'Unable to get kanas'});
  }
});

/**
 * Represents a book.
 * @constructor
 * @param {ParsedQs} query - The query
 */
function isValidQuery(query: ParsedQs): boolean {
  // Rejects non-truthy value in any parameter
  if (query && query.ro && query.ka && query.hi) {
    return true;
  }
  return false;
}

/**
 * Check if kana already exists in database
 * @param {Kana} kana the input kana to check for existence
 * @return {boolean} true if kana is not already in database, false otherwise
 */
async function isKanaInCollection(kana: Kana): Promise<boolean> {
  const collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> =
    await db.collection(kanaCollectionName);

  const filteredQuery1: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
    await collection.where('ro', '==', kana.ro);

  const filteredQuery2 = await filteredQuery1.where('hi', '==', kana.hi);

  const queryResult: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> =
    await filteredQuery2.get();

  const isKanaFound: boolean = queryResult.size > 0;

  return isKanaFound;
}
