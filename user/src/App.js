import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LatestArticles from './components/LatestArticles';
import LatestResearch from './components/LatestResearch';
import LatestNews from './components/LatestNews';
import LatestEvents from './components/LatestEvents';
import FAQ from './components/FAQ';
import WebsiteScroller from './components/WebsiteScroller';
import HelpCenter from './components/HelpCenter';
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <HelpCenter />
      <LatestArticles />
      <LatestResearch />
      <LatestNews />
      <LatestEvents />
      <FAQ />
      <WebsiteScroller />
      <Footer />
    </div>
  );
}

export default App;
