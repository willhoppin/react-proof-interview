import Image from 'next/image';
import { useState, useEffect } from 'react';
import { auth, firestore } from '../app/firebase'; 
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  getRedirectResult
} from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore'; 
import { browserSessionPersistence, setPersistence } from 'firebase/auth';
import { createCheckoutSession } from "../../stripe/createCheckoutSession"
import { getDoc } from 'firebase/firestore';

function AuthButtons(props) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpgradeLoading, setIsUpgradeLoading] = useState(false);
  
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Set session persistence
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        console.log("Session persistence set successfully.");
      })
      .catch(error => {
        console.error("Error setting persistence:", error);
      });

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpgradeButtonClick = (uid) => {
      setIsUpgradeLoading(true);
      createCheckoutSession(uid);
  };

  useEffect(() => {
      if (isUpgradeLoading) {
          const timer = setTimeout(() => {
              setIsUpgradeLoading(false);
          }, 4000); // 4 seconds

          return () => clearTimeout(timer);
      }
  }, [isUpgradeLoading]);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      
      // Using signInWithPopup to get the user result
      const result = await signInWithPopup(auth, provider);
      
      // Check if the result and result.user are not null or undefined
      if (result && result.user) {
        setUser(result.user);
        
        const userRef = doc(collection(firestore, "users"), result.user.uid);
        const userSnap = await getDoc(userRef);
  
        // If the user document doesn't exist, it means the user is new
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: result.user.uid,
            email: result.user.email,
            name: result.user.displayName,
            provider: result.user.providerData[0].providerId,
            photoUrl: result.user.photoURL,
            wordsWritten: 0   // Set wordsWritten to 0 for new users
          });
        }
      } else {
        console.log("No user data found in the sign-in result.");
      }
    } catch (error) {
      console.error("There was an error signing in", error);
    }
  };  

  const signOutFromFirebase = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("There was an error signing out", error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  }

  return (
    <div className="text-[#0881FC] p-4 bg-white flex justify-between items-start">
        <Image className="hover:opacity-60 cursor-pointer" src="/logo.png" alt="Essay Doer Bot Logo" width={100} height={30} />

        {loading ? (
          <div>Loading user info...</div>
        ) : user ? (
          <div className="relative">
            <div 
              className="flex items-center cursor-pointer"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
              onTouchStart={toggleDropdown} // Added touch event
              onClick={toggleDropdown}
            >
                <span className="mr-4 italic">
                  {user.displayName}{props.userIsPremium ? <span className="font-bold"> (premium)</span> : ""}
                </span>

                <img src={user.photoURL} alt="User Photo" className="h-10 w-10 rounded-full" />
                
                <div 
                    className={`mt-36 absolute top-[calc(100% - 2px)] right-0 bg-white w-72 border rounded shadow-lg p-2 z-9 ${showDropdown ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                >
                  
                    {props.userIsPremium ? (
                      <a href="https://billing.stripe.com/p/login/00g3fE7fQ2Zu8mYcMM" className="flex px-2 mr-2 py-2 hover:font-bold hover:mr-0">
                          <Image className="mr-3 h-fit" src="/money.png" alt="Money" width={25} height={25} />
                          <span>Manage Subscription</span>
                      </a> 
                    ) : (
                      <a onClick={() => handleUpgradeButtonClick(user.uid)} className="flex px-2 mr-2 py-2 hover:font-bold hover:mr-0">
                          <Image className="mr-3 h-fit" src="/money.png" alt="Money" width={25} height={25} />
                          <span>{isUpgradeLoading ? 'Loading...' : 'Go Premium'}</span>
                      </a>
                    )}
                    
                    <button onClick={signOutFromFirebase} className="flex w-full text-left px-2 py-2 hover:font-bold">
                        <Image className="mr-3 h-fit" src="/hand.png" alt="Hand" width={25} height={25} />
                        <span>Logout</span>
                    </button>
                </div>

            </div>
          </div>
        ) : (
          <button onClick={signInWithGoogle} className="bg-white shadow-md shadow-[#C7E3FF] text-[#0881FC] px-4 py-2 rounded-full font-bold flex items-center space-x-2 hover:opacity-80">
            <Image src="/google.png" alt="Google Logo" width={20} height={20} />
            <span>Login with Google</span>
          </button>
        )}
    </div>
  );
}

export default AuthButtons;