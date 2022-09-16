import * as functions from "firebase-functions";
import { Request, Response } from "firebase-functions";
import { QueryDocumentSnapshot } from "firebase-functions/v1/firestore";
import { ParsedQs } from "qs";
import type { Kana } from "./kanaModel";

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');

const cors = require("cors")({ origin: true });

admin.initializeApp();

// POST request to add a valid kana to database
exports.addKana = functions.https.onRequest(async (req:Request, res: Response) => {
  cors(req, res,async () => {
    try {
      if (isValidQuery(req.query)) {
        // Do Kana procesing
        const kana: Kana = req.query as unknown as Kana
        const en: string = kana.en
        if (en.length > 1 || en == "n") {
          kana.consonant = true
        }
        else
        {
          kana.consonant = false
        }
        const writeResult = await admin.firestore().collection('kanas').add(kana);
        res.status(400).json({result: `Kana with ID: ${writeResult.id} added.`});
      }
      else
      {
        res.status(400).json({result: `Request invalid: ${JSON.stringify(req.query)} not added.`});

      }      
    } catch (error: any) {
      res.status(500).json(error.message);
    }
    
  })
  
})

// GET request get al Kanas
exports.getKanas = functions.https.onRequest(async (req:Request, res: Response) => {
  cors(req, res,async () => {
    try {
        // Get database snapshot
        const querySnapshot: QueryDocumentSnapshot[]  = await admin.firestore().collection('kanas').get(); 
        console.log(querySnapshot)
        const kanas: any[] = []
        querySnapshot.forEach((doc: any) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          kanas.push(doc.data())
        });
        res.status(400).json({result: kanas});
      
    } catch (error: any) {
      res.status(500).json(error.message);
    }
    
  })
  
})

function isValidQuery(query: ParsedQs): boolean {
  if (query && query.en && query.jp && query.category) {
    return true;
  }
  return false;
}
