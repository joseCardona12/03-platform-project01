'use client';

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Datum, Metadata } from "@/app/core/application/dto/common/projectResponseDto";
import inputAlert from "@/ui/atoms/Alert";

interface TableDashboardClientProps {
  initialData: Datum[];
  initialMetadata: Metadata;
}

const TableDashboardClient: React.FC<TableDashboardClientProps> = ({ initialData, initialMetadata }) => {
  const [rows, setRows] = useState<Datum[]>(initialData);
  const [metadata, setMetadata] = useState<Metadata>(initialMetadata);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRow, setEditingRow] = useState<Datum | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (searchQuery === "") {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/projects?page=${page + 1}`);
          const { data, metadata } = await response.json();
          setRows(data);
          setMetadata(metadata);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }
  }, [page, searchQuery]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
  
    const allData: Datum[] = [];
    let currentPage = 1;
    let totalPages = 1;
  
    try {
      do {
        const response = await fetch(`/api/projects?page=${currentPage}`);
        const { data, metadata } = await response.json();
  
        allData.push(...data);
        totalPages = metadata.totalPages;
        currentPage += 1;
      } while (currentPage <= totalPages);
  
      const filteredRows = allData.filter((row) =>
        row.title.toLowerCase().includes(query.toLowerCase()) ||
        row.description.toLowerCase().includes(query.toLowerCase())
      );
  
      setRows(filteredRows);
    } catch (error) {
      console.error("Error fetching all pages for search:", error);
    }
  };
  

  const handleEdit = (row: Datum) => {
    setEditingRow({ ...row });
  };

  const handleSave = async () => {
    if (!editingRow) return;

    try {
      const response = await fetch(`/api/projects?id=${editingRow.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingRow),
      });

      if (!response.ok) {
        throw new Error("Error saving changes");
      }

      setRows((prev) =>
        prev.map((row) => (row.id === editingRow.id ? editingRow : row))
      );
      setEditingRow(null);
      inputAlert("Updated correctly", "success")
    } catch (error) {
      console.error("Error saving changes:", error);
      inputAlert("Error to update", "error");
    }
  };

  const handleDelete = async () => {
    if (!rowToDelete) return;

    try {
      const response = await fetch(`/api/projects?id=${rowToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Error deleting project");
      }

      setRows((prev) => prev.filter((row) => row.id !== rowToDelete));
      setRowToDelete(null);
      setDeleteDialogOpen(false);
      inputAlert("Deleted project correctly", "success");
    } catch (error) {
      console.error({
        message:`Error to delete project Error: ${error}`
      });
      inputAlert("Errro to delete project", "error");
    }
  };

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Título', flex: 1, minWidth: 150 },
    { field: 'description', headerName: 'Descripción', flex: 2, minWidth: 250 },
    {
      field: 'startDate',
      headerName: 'Fecha de Inicio',
      flex: 1,
      minWidth: 150,
      renderCell: ({ value }) => (
        value ? new Intl.DateTimeFormat('es-ES', { timeZone: 'UTC' }).format(new Date(value)) : '-'
      )
    },
    {
      field: 'endDate',
      headerName: 'Fecha de Fin',
      flex: 1,
      minWidth: 150,
      renderCell: ({ value }) => (
        value ? new Intl.DateTimeFormat('es-ES', { timeZone: 'UTC' }).format(new Date(value)) : '-'
      )
    },
    
    {
      field: 'status',
      headerName: 'Estado',
      flex: 1,
      minWidth: 120,
      renderCell: ({ value }) => (
        <Chip
          label={value ? "Inactivo" : "Activo"}
          sx={{
            bgcolor: value ? "gray" : "green",
            color: "white",
            borderRadius: "16px",
            fontWeight: "bold",
            padding: "0 10px",
          }}
        />
      ),
    },
    {
      field: 'organizer',
      headerName: 'Organizador',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => params.value?.name || "Sin asignar"
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <div className="flex gap-2 items-center mt-2">
          <Button
            variant="outlined"
            sx={{
              borderColor: 'lightgray',
              color: 'black',
              '&:hover': {
                borderColor: 'darkgray',
              },
            }}
            onClick={() => handleEdit(params.row)}
          >
            Editar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setRowToDelete(params.row.id);
              setDeleteDialogOpen(true);
            }}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Lista de Proyectos</h2>
      <input
        type="text"
        placeholder="Buscar..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 mb-4 w-1/4"
      />
      <div style={{ height: 700, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          paginationMode="server"
          rowCount={metadata.totalItems}
          paginationModel={{ page, pageSize: 10 }}
          onPaginationModelChange={(model) => setPage(model.page)}
          pageSizeOptions={[5, 10, 25]}
          sx={{ border: 0 }}
        />
      </div>

      {editingRow && (
        <Dialog open={Boolean(editingRow)} onClose={() => setEditingRow(null)}>
          <DialogTitle>Editar Proyecto</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              label="Título"
              value={editingRow.title}
              onChange={(e) => setEditingRow({ ...editingRow, title: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Descripción"
              value={editingRow.description}
              onChange={(e) => setEditingRow({ ...editingRow, description: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Fecha de Inicio"
              type="date"
              value={editingRow.startDate.split('T')[0]}
              onChange={(e) => setEditingRow({ ...editingRow, startDate: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Fecha de Fin"
              type="date"
              value={editingRow.endDate.split('T')[0]}
              onChange={(e) => setEditingRow({ ...editingRow, endDate: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingRow(null)} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleSave} color="success">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Modal para Confirmar Eliminación */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TableDashboardClient;
