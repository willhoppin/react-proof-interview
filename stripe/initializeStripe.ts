import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null;

const initializeStripe = async () => {
    if (!stripePromise) {
        stripePromise = loadStripe("pk_live_51NpJ69APAMxMJmcj7Pmbee785QpY544TaouaItrmwN1orTrN4yCMmO9t1oF0dzZuBQgo2FQTLMCWaeEQqjIRBES100axxV6ftX");
    }
    return stripePromise;
};

export default initializeStripe;
