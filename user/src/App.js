import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import Article from './pages/Article';
import Research from './pages/Research';
import ContactUs from './pages/ContactUs';

function App() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <Navbar onOpenAuth={() => setAuthOpen(true)} />
      <section id="home"><Home /></section>
      <section id="article"><Article /></section>
      <section id="research"><Research /></section>
      <section id="contact"><ContactUs /></section>
      <Footer onOpenAuth={() => setAuthOpen(true)} />
      <AuthPage isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

export default App;
