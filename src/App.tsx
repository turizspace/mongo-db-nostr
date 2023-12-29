import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import { generateRoutes } from './routes/routes.tsx';
import { SimplePool, Event } from 'nostr-tools';
import SigninNostr from './Components/SigninNostr.tsx';
import Create from './Components/Create.tsx';
import { useDebounce } from "use-debounce";
import './App';

export const RELAYS = [
  'wss://relay.damus.io',
  'wss://relay.primal.net',
  'wss://relay.nostr.band',
  'wss://relay.snort.social',
];

export interface Metadata {
  name?: string;
  picture?: string;
  nip05?: string;
  about?: string;
}

function App() {
  const routes = generateRoutes();

  const [pool, setPool] = useState(new SimplePool());
  const initialEvents: Event[] = [];
  const [eventIMMEdiate, setEvents] = useState(initialEvents);
  const [events] = useDebounce(eventIMMEdiate, 1800);

  const [metadata, setMetadata] = useState<Record<string, Metadata>>({});
  const fetchedData = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const _pool = new SimplePool();
    setPool(_pool);

    return () => {
      _pool.close(RELAYS);
    };
  }, []);

  useEffect(() => {
    if (!pool) return;

    const sub = pool.sub(RELAYS, [
      {
        kinds: [1],
        limit: 100,
    //    "#t": ['weedstr']
      },
    ]);

    sub.on('event', (event: Event) => {
      setEvents((events) => [...events, event]);
    });

    return () => {
      sub.unsub();
    };
  }, [pool]);

  useEffect(() => {
    if (!pool) return;

    const fetchPubKey = events
      .filter((event) => fetchedData.current[event.pubkey] !== true)
      .map((event) => event.pubkey);

    fetchPubKey.forEach((pubkey) => {
      fetchedData.current[pubkey] = true;
    });

    const sub = pool.sub(RELAYS, [
      {
        kinds: [0],
  //      authors: '06830f6cb5925bd82cca59bda848f0056666dff046c5382963a997a234da40c5',
        authors: fetchPubKey,
      },
    ]);




    sub.on('event', (event: Event) => {
      const parsedMetadata = JSON.parse(event.content) as Metadata;

      setMetadata((current) => ({
        ...current,
        [event.pubkey]: parsedMetadata,
      }));
    });




    sub.on('eose', () => {
      sub.unsub();
    });


    return () => {};
  }, [events, pool]);



  return (
    <div className="App">
    <Router>
        <h1 className="text-h1">DUSTR</h1>
        <Routes>
          {routes.map((route, index) => (
            <Route {...route} />
          ))}
        </Routes>
      </Router>
      </div>
  );
}

export default App;
