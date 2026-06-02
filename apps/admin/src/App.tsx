import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ScrollToTop } from './components/helpers/ScrollToTop';
import SignIn from './components/SignIn/SignIn';
import queryClient from './config/react-qeury';
import { AuthProvider } from './context/AuthContext';
import Homepage from './pages/Homepage';
import SignupPage from './pages/SignUp';

const App = () => {
  return (
    <>
      {/* <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'> */}
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <Routes>
              <Route path='/signin' element={<SignIn />} />
              <Route path='/signup' element={<SignupPage />} />

              <Route path='/' element={<Homepage />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
      {/* </ThemeProvider> */}
    </>
  );
};

export default App;
