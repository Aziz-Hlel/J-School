import { QueryClientProvider } from '@tanstack/react-query';
import { Route, BrowserRouter as Router, Routes } from 'react-router';
import { ScrollToTop } from './components/helpers/ScrollToTop';
import SignIn from './components/SignIn/SignIn';
import queryClient from './config/react-qeury';
import { AuthProvider } from './context/AuthContext';
import { SchoolIdProvider } from './context/SchoolContext';
import { UserSessionProvider } from './context/UserContext';
import AuthenticatedRoutes from './guard/AuthenticatedRoutes';
import NetworkStatusGuard from './guard/NetworkStatusGuard';
import { ThemeProvider } from './lib/theme-provider';
import Classrooms from './pages/Classrooms';
import Feed from './pages/Feed';
import Homepage from './pages/Homepage';
import NotFound from './pages/NotFound';
import Sidebar from './pages/Sidebar';
import SignupPage from './pages/SignUp';
import Staff from './pages/Staff';
import Students from './pages/Students';

const App = () => {
  return (
    <>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <QueryClientProvider client={queryClient}>
          <NetworkStatusGuard>
            <Router>
              <ScrollToTop />
              <AuthProvider>
                <Routes>
                  <Route path='/signin' element={<SignIn />} />
                  <Route path='/signup' element={<SignupPage />} />
                  <Route element={<AuthenticatedRoutes />}>
                    <Route element={<UserSessionProvider />}>
                      <Route element={<SchoolIdProvider />}>
                        <Route element={<Sidebar dir={'ltr'} />}>
                          <Route path='/' element={<Homepage />} />

                          <Route path='/staff' element={<Staff />} />
                          <Route path='/classrooms' element={<Classrooms />} />
                          <Route path='/students' element={<Students />} />
                          <Route path='/feed' element={<Feed />} />
                          <Route path='*' element={<NotFound />} />
                        </Route>
                      </Route>
                    </Route>
                  </Route>
                </Routes>
              </AuthProvider>
            </Router>
          </NetworkStatusGuard>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
