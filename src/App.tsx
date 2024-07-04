import './App.css';
import { Login } from './components/login';
import { TaskGrid } from './components/task-grid';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from '../src/infra/private-routes';
// import { Error } from './components/error';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/tasks" element={<PrivateRoute />}>
            <Route path="" element={<TaskGrid />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
