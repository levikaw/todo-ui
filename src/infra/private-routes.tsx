import { Navigate, Outlet } from 'react-router-dom';

import { observer } from 'mobx-react-lite';
import { authStore } from './auth.store';

const PrivateRoute = () => {
  if (authStore.isAuthInProgress) {
    return <div>Checking auth...</div>;
  }
  if (authStore.isAuth) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export default observer(PrivateRoute);
