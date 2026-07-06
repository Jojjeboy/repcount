import { ref, onUnmounted } from 'vue';
import { db, auth } from '@/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';

export interface TallyHistory {
  value: number;
  goal: number;
  date: string;
}

export interface Tally {
  uuid: string;
  title: string;
  increseBy: number;
  decreseBy: number;
  reset: boolean;
  resetInterval: 'daily' | 'weekly' | 'monthly' | null;
  value: number;
  lastTouched: string;
  history: TallyHistory[];
  goal: number;
  topScore: number;
  active: boolean;
  color: string;
}

export function useTallies() {
  const tallies = ref<Tally[]>([]);
  let unsubscribe: (() => void) | null = null;

  const getTallies = () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'users', user.uid, 'tallies'));

    unsubscribe = onSnapshot(q, (snapshot) => {
      tallies.value = snapshot.docs.map(doc => ({
        uuid: doc.id,
        ...doc.data()
      })) as Tally[];
    });
  };

  const addTally = async (tally: Omit<Tally, 'uuid'>) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const colRef = collection(db, 'users', user.uid, 'tallies');
    const docRef = await addDoc(colRef, {
      ...tally,
      createdAt: serverTimestamp()
    });

    return docRef.id;
  };

  const updateTally = async (uuid: string, updates: Partial<Tally>) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const docRef = doc(db, 'users', user.uid, 'tallies', uuid);
    await updateDoc(docRef, updates);
  };

  const deleteTally = async (uuid: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const docRef = doc(db, 'users', user.uid, 'tallies', uuid);
    await deleteDoc(docRef);
  };

  onUnmounted(() => {
    if (unsubscribe) unsubscribe();
  });

  return {
    tallies,
    getTallies,
    addTally,
    updateTally,
    deleteTally
  };
}
