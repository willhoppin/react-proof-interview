import { auth } from "../src/app/firebase";
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

export default async function updateUserWordCount(newWordCount: number): Promise<void> {
    const user = auth.currentUser;
    if (!user) return;  // If no user, do nothing.

    try {
        const db = getFirestore();
        const userDocRef = doc(db, 'users', user.uid);

        // Assuming 'wordsWritten' is the field name for word count in the Firestore document
        await updateDoc(userDocRef, { wordsWritten: newWordCount });
    } catch (error) {
        console.error('Error updating word count:', error);
        throw error; // or handle it as appropriate
    }
}
