import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DateField } from '@mui/x-date-pickers/DateField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { instance } from '../infra/api';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { TaskEntity } from '../entities/tasks/task.entity';
import { UserEntity } from '../entities/users/user.entity';
import { PriorityType, StatusType } from '../entities/types';
import { SaveTask } from '../entities/tasks/save-task.interface';
import Modal from '@mui/material/Modal';
import { Error } from './error';
import { useEffect, useState } from 'react';
import { PRIORITY_NAMES, STATUS_NAMES } from '../entities/constants';

export function Task(props: { rowId: string | null; closeFunc: () => void }) {
  const { rowId } = props;
  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    backgroundColor: '#fff',
    padding: 4,
    overflow: 'scroll',
    height: '90vh',
  };

  const [task, setTask] = useState<TaskEntity>({} as TaskEntity);
  const [users, setUsers] = useState([]);
  const [success, setSuccess] = useState('');

  const handleClose = () => setSuccess('');
  const handleChange = (
    event:
      | SelectChangeEvent<string>
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const currEvent = event.target;

    if (currEvent.name === 'assignedTo') {
      setTask({
        ...task,
        assignedTo: { ...task.assignedTo, id: String(currEvent.value) },
      });
    } else {
      setTask({ ...task, [currEvent.name]: currEvent.value });
    }
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    saveTask({
      title: String(data.get('title')),
      description: String(data.get('description')),
      status: String(data.get('status')) as StatusType,
      priority: String(data.get('priority')) as PriorityType,
      assignedToId: String(data.get('assignedTo')),
      expiredAt: dayjs(String(data.get('expiredAt')), 'DD.MM.YYYY')
        .add(1, 'day')
        .toDate(),
    });
  };

  const fetchTask = async () =>
    await instance.get(`/task/${rowId}`).then((resp) => setTask(resp.data));

  const fetchUsers = async () =>
    await instance.get('/user').then((resp) => setUsers(resp.data));

  const saveTask = async (body: SaveTask) => {
    if (rowId) {
      await instance
        .patch(`/task/${rowId}`, body)
        .then(() => props.closeFunc())
        .catch(() => setSuccess('Cannot update task'));
    } else {
      await instance
        .post('/task', body)
        .then(() => props.closeFunc())
        .catch(() => setSuccess('Cannot create task'));
    }
  };

  useEffect(() => {
    fetchUsers();
    if (rowId) {
      fetchTask();
    }
  }, []);

  return (
    <div>
      <Box style={style}>
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
              <Typography component="h1" variant="h5">
                {rowId ? 'Update task' : 'Create task'}
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <Stack spacing={2} width="500px">
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="title"
                    label="title"
                    name="title"
                    onChange={handleChange}
                    value={task.hasOwnProperty('title') ? task['title'] : ''}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    multiline
                    name="description"
                    onChange={handleChange}
                    label="description"
                    value={
                      task.hasOwnProperty('description')
                        ? task['description']
                        : ''
                    }
                    id="description"
                  />
                  <FormControl fullWidth>
                    <InputLabel required id="priority">
                      priority
                    </InputLabel>
                    <Select<PriorityType>
                      labelId="priority"
                      id="priority"
                      name="priority"
                      autoWidth
                      onChange={handleChange}
                      required
                      label="priority"
                      value={
                        task.hasOwnProperty('priority')
                          ? task['priority']
                          : 'medium'
                      }
                    >
                      {Object.values(PRIORITY_NAMES).map((priority: string) => (
                        <MenuItem key={priority} value={priority}>
                          {priority}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel required id="status">
                      status
                    </InputLabel>
                    <Select<StatusType>
                      labelId="status"
                      id="status"
                      name="status"
                      autoWidth
                      onChange={handleChange}
                      required
                      label="status"
                      value={
                        task.hasOwnProperty('status')
                          ? task['status']
                          : 'backlog'
                      }
                    >
                      {Object.values(STATUS_NAMES).map((status: string) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel required id="assignedTo">
                      assignedTo
                    </InputLabel>
                    <Select<string>
                      labelId="assignedTo"
                      id="assignedTo"
                      name="assignedTo"
                      onChange={handleChange}
                      autoWidth
                      required
                      label="assignedTo"
                      value={
                        task.hasOwnProperty('assignedTo')
                          ? task['assignedTo'].id
                          : ''
                      }
                    >
                      {users.map((user: UserEntity) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateField
                        format="DD.MM.YYYY"
                        name="expiredAt"
                        // contentEditable={true}
                        value={
                          task.hasOwnProperty('expiredAt')
                            ? dayjs(task['expiredAt'])
                            : dayjs().add(7, 'day')
                        }
                        required
                        label="expiredAt"
                      />
                    </LocalizationProvider>
                  </FormControl>
                </Stack>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </Box>
      <Modal
        open={!!success}
        onClose={handleClose}
        aria-labelledby="save-task-error"
        aria-describedby="save-task-error"
      >
        <>
          <Error message={success} />
        </>
      </Modal>
    </div>
  );
}
