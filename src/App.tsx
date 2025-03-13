import { Outlet } from 'react-router';
import { Navbar } from './components/layout/navbar';
import { Footer } from './components/layout/footer';
import { AuthContextProvider } from './components/context/authContext';
import Cookies from 'js-cookie';

function App() {
  const initialToken = Cookies.get('jwt') || ''; 
  return (
    <AuthContextProvider initialToken={initialToken}> 
    <div>
      <Navbar />
      <div className="min-h-[calc(100vh-80px)]">
        <Outlet />
      </div>
      <Footer />
    </div>
    </AuthContextProvider> 
  );
}

export default App;
