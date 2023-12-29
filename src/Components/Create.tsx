import React from "react";
import { Link, BrowserRouter as Router, Route, Outlet } from 'react-router-dom';

interface Props {}

export default function Create({}: Props) {
  const onClick = async () => {
    if (!window.nostr) {
      window.alert("Nostr extension not found. Please install it.");
      return;
    }


    const _baseEvent = {
      content: '',
      created_at: Math.round(Date.now() / 1000),
      kind: 1,
      tags: [],
    } as EventTemplate

    try {

      const pubkey = await window.nostr.getPublicKey();
      const sig = await (await window.nostr.signEvent(_baseEvent)).sig;


      const existsInDatabase = await checkPubkeyInDatabase(pubkey);

      if (existsInDatabase) {
        window.alert("User already exists!");
      } else {
        await fetch("http://localhost:3001/storePubkey", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pubkey }),
        });

        console.log("Pubkey sent to server:", pubkey);
      }
    } catch (error) {
      window.alert("Error occurred while processing pubkey");
    }
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>
        <p style={{ fontSize: '1.5rem', fontFamily: 'Montserrat, sans-serif', marginBottom: '20px' }}>Sign up to get in</p>
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
          Sign up with nostr
        </button>
          <p>Already have an account? <Link to="/signin">Sign in</Link></p>
      </div>
    </div>
  );
}
