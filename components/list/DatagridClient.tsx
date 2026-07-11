'use client'

import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: 'first_name', headerName: 'Staff Name', width: 200 },
  { field: 'last_name', headerName: '', width: 200 },
];

export default function ({ rows }: any) {
  return (
    <div>
      <DataGrid rows={rows} columns={columns} />

    </div>
  )
}