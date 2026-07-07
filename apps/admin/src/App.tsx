import { QueryClientProvider } from '@tanstack/react-query';
import { Outlet, Route, BrowserRouter as Router, Routes } from 'react-router';
import { Toaster } from 'sonner';
import { ScrollToTop } from './components/helpers/ScrollToTop';
import SignIn from './components/SignIn/SignIn';
import StudentProfile from './components/Students/student-profile';
import StudentFees from './components/Students/student-profile/layout/FeesPage/StudentFees';
import StudentHealth from './components/Students/student-profile/layout/HealthPage/StudentHealth';
import StudentOverview from './components/Students/student-profile/layout/OverviewPage/StudentOverview';
import StudentParents from './components/Students/student-profile/layout/ParentsPage/StudentParents';
import queryClient from './config/react-qeury';
import { AuthProvider } from './context/AuthContext';
import { SchoolIdProvider } from './context/SchoolContext';
import { UserSessionProvider } from './context/UserContext';
import AuthenticatedRoutes from './guard/AuthenticatedRoutes';
import NetworkStatusGuard from './guard/NetworkStatusGuard';
import OnboardingOwnerAndSchoolCompleted from './guard/OnboardingSchoolCompleted';
import { ThemeProvider } from './lib/theme-provider';
import AssignmentsPage from './pages/Assignments';
import Attendance from './pages/Attendance';
import Calendar from './pages/Calendar';
import Classrooms from './pages/Classrooms';
import ExamSchedule from './pages/ExamSchedule';
import Feed from './pages/Feed';
import Homepage from './pages/Homepage';
import NotFound from './pages/NotFound';
import OwnerBoarding from './pages/OwnerBoarding';
import Parents from './pages/Parents';
import SchoolBoarding from './pages/SchoolBoarding';
import Sidebar from './pages/Sidebar';
import SignupPage from './pages/SignUp';
import Staff from './pages/Staff';
import Students from './pages/Students';
import Teachers from './pages/teachers';
import Timetable from './pages/Timetable';

const App = () => {
  return (
    <>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <NetworkStatusGuard>
            <Router>
              <ScrollToTop />
              <AuthProvider>
                <Routes>
                  <Route path='/signin' element={<SignIn />} />
                  <Route path='/signup' element={<SignupPage />} />
                  <Route element={<AuthenticatedRoutes />}>
                    <Route element={<UserSessionProvider />}>
                      <Route path='/on-boarding' element={<Outlet />}>
                        <Route path='profile' element={<OwnerBoarding />} />
                        <Route path='school' element={<SchoolBoarding />} />
                      </Route>

                      <Route element={<OnboardingOwnerAndSchoolCompleted />}>
                        // ? ask for coriosity if this okay to do
                        <Route element={<SchoolIdProvider />}>
                          <Route element={<Sidebar dir={'ltr'} />}>
                            <Route path='/' element={<Homepage />} />
                            <Route path='/staff' element={<Staff />} />
                            <Route path='/teachers' element={<Teachers />} />
                            <Route path='/parents' element={<Parents />} />

                            <Route path='/students' element={<Outlet />}>
                              <Route index element={<Students />} />
                              <Route path=':studentId/profile' element={<StudentProfile />}>
                                <Route index path='overview' element={<StudentOverview />} />
                                <Route path='parents' element={<StudentParents />} />
                                <Route path='health' element={<StudentHealth />} />
                                <Route path='fees' element={<StudentFees />} />
                              </Route>
                            </Route>
                            <Route path='/classrooms' element={<Classrooms />} />
                            <Route path='/assignments' element={<AssignmentsPage />} />
                            <Route path='/timetable' element={<Timetable />} />
                            <Route path='/exams' element={<ExamSchedule />} />
                            <Route path='/attendances' element={<Attendance />} />
                            <Route path='/calendar' element={<Calendar />} />
                            <Route path='/feed' element={<Feed />} />
                          </Route>
                        </Route>
                      </Route>
                    </Route>
                  </Route>

                  <Route path='*' element={<NotFound />} />
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
