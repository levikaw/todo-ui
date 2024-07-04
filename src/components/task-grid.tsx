import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isBetween from 'dayjs/plugin/isBetween';
import Button from '@mui/material/Button';
import { instance } from '../infra/api';
import { Task } from './task';
import Modal from '@mui/material/Modal';
import { TaskEntity } from '../entities/tasks/task.entity';
import { RowClassParams, RowClickedEvent } from 'ag-grid-enterprise';

dayjs.extend(isToday);
dayjs.extend(isBetween);

export function TaskGrid() {
  const [tasks, setTasks] = useState<TaskEntity[]>([]);
  const [rowId, setRowId] = useState(null);
  const [isCreateBtnClicked, setCreate] = useState(false);

  const handleClick = () => setCreate(true);
  const handleRowClick = (event: RowClickedEvent) => setRowId(event.data.id);
  const handleCloseModal = () => {
    fetchTasks();
    setCreate(false);
    setRowId(null);
  };

  const fetchTasks = async () => {
    await instance.get('/task').then((resp) => setTasks(resp.data));
  };

  const dueGetter = (expiredAt: string | Date): string => {
    const expired = dayjs(expiredAt);
    const today = dayjs();
    const week = today.add(7, 'day');

    if (expired.isToday()) {
      return 'due today';
    }
    if (expired.isBetween(today, week)) {
      return 'due week';
    }
    if (expired.isAfter(week)) {
      return 'more than week';
    }

    return 'expired';
  };

  const dateFormatter = (date: string | Date): string =>
    dayjs(date).format('DD.MM.YYYY');

  const gridData = tasks.map((row: TaskEntity) => ({
    due: dueGetter(row.expiredAt),
    ...row,
    expiredAt: dateFormatter(row.expiredAt),
    updatedAt: dateFormatter(row.updatedAt),
    createdAt: dateFormatter(row.createdAt),
  }));

  const columnDefs: ColDef[] = [
    { field: 'title', headerName: 'Заголовок' },
    {
      field: 'description',
      headerName: 'Описание',
      sortable: false,
      hide: true,
    },
    { field: 'status', headerName: 'Статус', sortable: false },
    { field: 'priority', headerName: 'Приоритет', sortable: false },
    { field: 'author.name', headerName: 'Создал', sortable: false, hide: true },
    {
      field: 'assignedTo.name',
      headerName: 'Назначен',
      enableRowGroup: true,
      sortable: false,
    },
    {
      field: 'createdAt',
      headerName: 'Дата создания',
      sortable: false,
      hide: true,
    },
    {
      field: 'updatedAt',
      headerName: 'Дата обновления',
      sort: 'asc',
      sortable: false,
      hide: true,
    },
    { field: 'expiredAt', headerName: 'Дата окончания', sortable: false },
    {
      field: 'due',
      headerName: 'период',
      enableRowGroup: true,
      rowGroup: true,
      sortable: false,
    },
  ];

  const getRowStyle = (params: RowClassParams) => {
    if (!params.node.group) {
      if (
        params.data.due === 'expired' &&
        ['done', 'canceled'].includes(params.data.status)
      ) {
        return { background: '#008000', color: '#FFFFFF' };
      } else if (params.data.due === 'expired') {
        return { background: '#ff0000', color: '#FFFFFF' };
      }
      return { background: '#808080', color: '#FFFFFF' };
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <Modal
        open={isCreateBtnClicked || !!rowId}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <Task rowId={rowId} closeFunc={handleCloseModal} />
        </>
      </Modal>
      <Button onClick={handleClick}>Click here to create Task</Button>
      <div
        className="ag-theme-alpine"
        style={{ height: '100vh', width: '100%' }}
      >
        <AgGridReact
          rowData={gridData}
          columnDefs={columnDefs}
          rowGroupPanelShow={'always'}
          groupDefaultExpanded={1}
          getRowStyle={getRowStyle}
          onRowClicked={handleRowClick}
        ></AgGridReact>
      </div>
    </div>
  );
}
