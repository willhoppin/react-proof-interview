import { collection, doc, addDoc, onSnapshot } from 'firebase/firestore'
import { firestore } from "../src/app/firebase";
import getStripe from "./initializeStripe";
import { DocumentSnapshot } from '@firebase/firestore-types';

export async function createCheckoutSession(uid: string) {
    const usersCollection = collection(firestore, "users");
    const userDoc = doc(usersCollection, uid);
    const checkoutSessionsCollection = collection(userDoc, "checkout_sessions");
    
    const checkoutSessionRef = await addDoc(checkoutSessionsCollection, {
        price: "price_1Nv5efAPAMxMJmcj3aRTuWyb",
        success_url: window.location.origin,
        cancel_url: window.location.origin,
    });

    // Wait for the CheckoutSession to get attached by the extension
    onSnapshot(doc(firestore, "users", uid, "checkout_sessions", checkoutSessionRef.id), async (snapshot) => {
        const data = snapshot.data();
        if (data && 'sessionId' in data) {
            const stripe = await getStripe();
            if (stripe) {
                stripe.redirectToCheckout({ sessionId: data.sessionId });
            } else {
                // Handle situation when stripe is null
                console.error("Failed to initialize Stripe");
            }
        }
    });
}
