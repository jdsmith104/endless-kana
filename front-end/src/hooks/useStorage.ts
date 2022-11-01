import { Storage } from '@ionic/storage';
import { useEffect, useState } from 'react';
import getKanas from '../controllers/kanas.controller';
import { Kana } from '../models/kanas.model';

const KANAS_KEY = 'kanas';
const LAST_CLIENT_SERVER_UPDATE_KEY = 'lsuk';
const LAST_CLIENT_SERVER_UPDATE_TIME = 1667299362942;

/**
 * Description Check if kana should be loaded from the store based on the last server update.
 * @param {Storage} store
 * @returns {Promise<boolean>} true if kana should be loaded from local store
 */
async function shouldUseKanaInStore(store: Storage): Promise<boolean> {
  const lastClientServerUpdateTime = await store.get(LAST_CLIENT_SERVER_UPDATE_KEY);
  if (
    lastClientServerUpdateTime &&
    lastClientServerUpdateTime >= LAST_CLIENT_SERVER_UPDATE_TIME
  ) {
    // Do nothing
    return true;
  }
  // Update store
  // Set get update boolean

  await store.set(LAST_CLIENT_SERVER_UPDATE_KEY, LAST_CLIENT_SERVER_UPDATE_TIME);
  return false;
}

/**
 * Read 'kanas' from store and write to UI using setKanas. If store is empty,
 * make request to server to read kanas and save to local store.
 * @param store the store to read for kanas
 * @param setKanas the function to set kanas
 */
async function getAndUpdateKanas(store: Storage, setKanas: Function) {
  const useKanaInLocalStore = await shouldUseKanaInStore(store);
  const storedKanas: Kana[] = await store.get(KANAS_KEY);
  // Added '&& storedKanas[0].hi' added to force the update on any legacy system
  if (storedKanas && useKanaInLocalStore && storedKanas.length > 0) {
    setKanas(storedKanas);
    console.log('Successfully read from localStorage: ', storedKanas.length);
  } else {
    const kanas: Kana[] = await getKanas();
    const ret: Kana[] = await store.set(KANAS_KEY, kanas);
    setKanas(kanas);

    const storeWriteSuccess: boolean = kanas === ret;
    if (storeWriteSuccess) {
      console.log('Written to store successfully');
    } else {
      console.log('Not written to store successfully');
    }
  }
}

export default function useStorage() {
  const [store, setStore] = useState<Storage>();
  const [kanas, setKanas] = useState<Kana[]>([]);

  useEffect(() => {
    const initStorage = async () => {
      const newStore = new Storage({ name: 'kanasDB' });
      const localStore: Storage = await newStore.create();
      setStore(localStore);
    };
    initStorage();
  }, []);

  // Reading logic contained in hook because the state: store must be instantiated before attempting a read
  useEffect(() => {
    if (store) {
      getAndUpdateKanas(store, setKanas);
    }
  }, [store]);

  return { kanas };
}
