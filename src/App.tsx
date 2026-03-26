import { Header } from "./components/Header";
import { RegionStatsBar } from "./components/RegionStatsBar";
import { KPISummary } from "./components/KPISummary";
import { FloodMap } from "./components/Map/FloodMap";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { ChatBot } from "./components/ChatBot/ChatBot";
import "./styles/globals.css";

function App() {
  return (
    <div className="app">
      <Header />
      <RegionStatsBar />
      <KPISummary />
      <div className="main-content">
        <FloodMap />
        <Sidebar />
      </div>
      <ChatBot />
    </div>
  );
}

export default App;
