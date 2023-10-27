import React, { useState } from 'react';
import { firestore } from '../app/firebase';   // Adjust path if it's different
import { collection, doc, setDoc } from 'firebase/firestore';

type FeedbackBoxProps = {
    currentUser: any;  // you can be more specific here if you know the exact shape of the user object
};

const FeedbackBox: React.FC<FeedbackBoxProps> = ({ currentUser }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async () => {
        try {
            const feedbackRef = collection(firestore, "feedback");
            const timestamp = new Date();
            const feedbackData = {
                user: currentUser ? currentUser.email : 'Not logged in',
                timestamp: timestamp,
                body: feedback
            };
            await setDoc(doc(feedbackRef), feedbackData);
            console.log("Feedback successfully written!");

            setIsOpen(false); 
            setFeedback('');
            setSubmitStatus('success');
            setTimeout(() => setSubmitStatus('idle'), 2000);
        } catch (error) {
            console.error("Error writing feedback:", error);
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus('idle'), 2000);
        }
    };

    const buttonClass = () => {
        switch (submitStatus) {
            case 'success':
                return 'bg-green-500';
            case 'error':
                return 'bg-red-500';
            default:
                return isOpen ? 'bg-gray-400 hover:bg-gray-300' : 'bg-[#0881FC] text-white hover:bg-[#67B2FF]';
        }
    };

    const buttonText = () => {
        switch (submitStatus) {
            case 'success':
                return 'Feedback submitted!';
            case 'error':
                return 'Server error';
            default:
                return isOpen ? 'Close' : 'Have feedback?';
        }
    };

    return (
        <>
            <button 
                className={`fixed bottom-4 right-4 py-2 px-4 rounded-full ${buttonClass()}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {buttonText()}
            </button>
            <div className={`fixed bottom-16 right-4 p-4 bg-white border rounded-xl shadow-lg ${isOpen ? 'block' : 'hidden'}`}>
                <textarea 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter your feedback or feature request!"
                    className="w-full h-32 py-2 px-3 border rounded-xl text-black"
                    style={{ resize: "none" }}
                />
                <button 
                    onClick={handleSubmit}
                    className="mt-2 bg-[#0881FC] text-white py-2 px-4 rounded-full hover:bg-[#67B2FF]"
                >
                    Submit
                </button>
            </div>
        </>
    );
}

export default FeedbackBox;
