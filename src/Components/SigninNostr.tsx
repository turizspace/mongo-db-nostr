import React, {useState} from "react";
import { Link, useNavigate, BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProfileCard from './ProfileCard'; // Import your ProfileCard component here or define it

interface User {
  name: string;
  picture: string;
  about: string;
}


const SigninNostr: React.FC<Props> = () => {
  const navigate = useNavigate(); // Access the history object
  const [loggedIn, setLoggedIn] = useState(false); // State to track if user is logged in


  const onClick = async () => {
    if (!window.nostr) {
      window.alert("Nostr extension not found. Please install it.");
      return;
    }

    try {
      const pubkey = await window.nostr.getPublicKey();

      const existsInDatabase = await checkPubkeyInDatabase(pubkey);

      if (existsInDatabase) {
        // Redirect to ProfileCard component upon successful sign-in
        navigate("/profile"); // Update the path as per your route configuration
      } else {
        window.alert("User not found. Please sign up.");
        // Optionally navigate to the sign-up page or provide instructions for signing up
      }
    } catch (error) {
      window.alert("Error occurred while processing sign-in");
      // Handle the error gracefully, log it, or display an appropriate message to the user
    }
    setLoggedIn(true);
    navigate('/profile');
  };

  const checkPubkeyInDatabase = async (pubkey: string): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:3001/checkPubkey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pubkey }),
      });

      const data = await response.json();
      return data.existsInDatabase;
    } catch (error) {
      console.error("Error checking pubkey:", error);
      return false;
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          loggedIn ? (
            <Navigate to="/profile" />
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <div>
                <p style={{ fontSize: '1.5rem', fontFamily: 'Montserrat, sans-serif', marginBottom: '20px' }}>Sign in to your account</p>
                <button
                  style={{
                    borderRadius: '5px',
                    backgroundColor: '#EFEAC5',
                    padding: '8px 16px',
                    margin: '3px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                  onClick={onClick}
                >
                  Sign in with nostr
                </button>
                <p>
                  Already have an account? <Link to="/">Sign up</Link>
                </p>
              </div>
            </div>
          )
        }
      />

      <Route
        path="/profile"
        element={
          loggedIn ? (
    <ProfileCard created_at={created_at} user={user} pubkey={pubkey} display_name={display_name} about={about}/>
            ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
};

export default SigninNostr;
