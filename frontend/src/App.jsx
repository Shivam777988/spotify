import './App.css';
import { Route, Routes } from 'react-router-dom';
import LayOut from './layout';
import RegisterPage from './pages/Registerpage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import Secret from './pages/adminPass';
import { SecretProvider, useSecret } from './UserContext'; 
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './AdminLayout';
import AdminUploads from './pages/AdminUploads';
import AdminSongsPage from './pages/AdminSongsPage';
import SongPage from './components/SongPage';
// ✅ import context

// ✅ Protected route using context
function ProtectedAdminRoute({ element }) {
  const { isSecretVerified } = useSecret();
  

  return isSecretVerified ? element : <div>Unauthorized</div>;
    

}
function ProtectedAdminpanel({ element }) {
  const { isAdmin} = useSecret();
  

  return isAdmin ? element : <div>Unauthorized</div>;
    

}

function App() {
  return (
    <SecretProvider>
   <Routes>
  <Route path="/" element={<LayOut />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/secret" element={<Secret />} />
 <Route path="/songs/:id" element={<SongPage />} />
  {/* ✅ Protected Admin Routes (Nested under AdminLayout) */}
  <Route
    path="/admin/*"
    element={<ProtectedAdminpanel element={<AdminLayout />} />}
  >
    <Route path="dashboard" element={<AdminDashboard />} />
    {/* Future Routes like: */}
 <Route path="uploads" element={<AdminUploads />} /> 
 <Route path="edit" element={<AdminSongsPage/>}/>
 
    {/* <Route path="users" element={<UsersList />} /> */}
  </Route>

  {/* ✅ Secret protected registration */}
  <Route
    path="/admin/register"
    element={<ProtectedAdminRoute element={<AdminRegisterPage />} />}
  />
</Routes>
    </SecretProvider>
  );
}

export default App;
