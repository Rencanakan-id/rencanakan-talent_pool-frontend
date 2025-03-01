import { Outlet } from 'react-router';
import { Navbar } from './components/layout/navbar';
import { Footer } from './components/layout/footer';

function App() {
  return (
    <div>
      <Navbar />
      <div className="min-h-[calc(100vh-80px)]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
