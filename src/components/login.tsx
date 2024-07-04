import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navigate } from 'react-router';
import { authStore } from '../infra/auth.store';
import { instance } from '../infra/api';
import Modal from '@mui/material/Modal';
import { Error } from './error';

export function Login() {
  const [isAuth, setAuth] = React.useState(false);
  const [success, setSuccess] = React.useState('');
  const [id, setFormId] = React.useState('signin-form');

  const handleClick = (event: React.MouseEvent) =>
    setFormId(event.currentTarget.id);
  const handleCloseModal = () => setSuccess('');
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const id = event.currentTarget.id;

    event.preventDefault();

    const data = new FormData(event.currentTarget),
      login = String(data.get('login')),
      password = String(data.get('password'));

    const authFunc = async () =>
      await authStore.login(login, password).then((resp) => {
        if (authStore.isAuth) {
          setAuth(true);
        } else {
          switch (resp) {
            case 401:
              setSuccess('Wrong password');
              break;
            case 404:
              setSuccess('Wrong login');
              break;

            default:
              setSuccess('Unable to auth');
              break;
          }
        }
      });

    if (`${id}-form` === 'signin-form') {
      authFunc();
    } else {
      await instance
        .post('/user', { login, password })
        .then(() => authFunc())
        .catch(() => setSuccess('User already exists'));
    }
  };

  return (
    <div>
      <ThemeProvider theme={createTheme()}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              id={id}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="login"
                label="Login"
                name="login"
                autoComplete="login"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Stack direction="row" spacing={2}>
                <Button
                  type="submit"
                  id="signup"
                  onClick={handleClick}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up as user
                </Button>
                <Button
                  type="submit"
                  id="signin"
                  fullWidth
                  onClick={handleClick}
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Log In
                </Button>
              </Stack>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
      {isAuth && <Navigate to="/tasks" replace={true} />}
      <Modal
        open={!!success}
        onClose={handleCloseModal}
        aria-labelledby="login-error"
        aria-describedby="login-error"
      >
        <>
          <Error message={success} />
        </>
      </Modal>
    </div>
  );
}
