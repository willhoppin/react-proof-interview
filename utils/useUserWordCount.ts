import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import getUserWordCount from "./returnUserWordCount";

export default function useUserWordCount(user: User | null | undefined): number {
    const [wordCount, setWordCount] = useState<number>(0);

    useEffect(() => {
        if (user) {
            const fetchWordCount = async function () {
                setWordCount(await getUserWordCount());
            };
            fetchWordCount();
        }
    }, [user]);
    
    return wordCount;
}
