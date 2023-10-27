import { firebase, auth } from "../src/app/firebase";

export default async function isUserPremium(): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;

    await user.getIdToken(true);
    const decodedToken = await user.getIdTokenResult();

    return decodedToken?.claims?.stripeRole ? true : false;
}