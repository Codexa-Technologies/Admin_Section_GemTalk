import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import HeroSection from './components/HeroSection';
import LatestArticles from './components/LatestArticles';
import LatestResearch from './components/LatestResearch';
import LatestNews from './components/LatestNews';
import LatestEvents from './components/LatestEvents';
import FAQ from './components/FAQ';
//import WebsiteScroller from './components/WebsiteScroller';
import HelpCenter from './components/HelpCenter';
import Footer from './components/Footer';
import ArticlesPage from './pages/ArticlesPage';
import ResearchPage from './pages/ResearchPage';
import NewsPage from './pages/NewsPage';
import EventsPage from './pages/EventsPage';
import FAQPage from './pages/FAQPage';

function HomePage() {
  return (
    <>
      <HeroSection />
      <HelpCenter />
      <LatestArticles />
      <LatestResearch />
      <LatestNews />
      <LatestEvents />
      <FAQ />
    </>
  );
}

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onLoginClick={() => openAuth('login')} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Routes>
      </main>
      <Footer />
      <AuthModal
        isOpen={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onModeChange={setAuthMode}
      />
    </div>
  );
}

export default App;
