import { auth } from "../src/app/firebase";
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default async function getUserWordCount(): Promise<number> {
    const user = auth.currentUser;
    if (!user) return 0;  // return default word count if no user

    const db = getFirestore();
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    // Assuming 'wordsWritten' is the field name for word count in the Firestore document
    return userDocSnap.data()?.wordsWritten || 0;
}
