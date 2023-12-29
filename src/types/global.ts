import { EventTemplate, Event } from "nostr-tools";

declare global {
  interface Window {
    nostr: Nostr;
  }
}

type Nostr = {
  getPublicKey(): Promise<string>;
  signEvent(event: EventTemplate): Promise<Event>;
};
// global.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    // Add definitions for HTML elements as needed
    div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    // ... add other elements you use in your components
  }
}
