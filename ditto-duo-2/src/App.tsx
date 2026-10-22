import {useEffect} from 'react';
import {Footer, Header, StickyCta} from './components/Chrome';
import {Compliance} from './components/Compliance';
import {Demo} from './components/Demo';
import {Honest} from './components/Honest';
import {More} from './components/More';
import {OneTrip} from './components/OneTrip';
import {Roles} from './components/Roles';
import {Yard} from './components/Yard';
import {useReducedMotion} from './hooks/useReducedMotion';
import {startScroll} from './lib/scroll';

export default function App() {
  const reduced = useReducedMotion();
  useEffect(() => startScroll(reduced), [reduced]);

  return (
    <>
      <Header />
      <main>
        <Yard />
        <Compliance />
        <OneTrip />
        <Roles />
        <More />
        <Honest />
        <Demo />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
