'use client'
import { useSession, signOut } from "next-auth/react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import inputAlert from "@/ui/atoms/Alert";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

export default function DashboardTopNavBar() {
  const { data: session } = useSession();

  if (!session) return <p>Loading...</p>;

  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = async () => {
    const token = session?.user?.token;

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, startDate, endDate }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      handleClose();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleDownloadReport = async () => {
    const token = session?.user?.token;
    try {
      const response = await fetch("/api/projects/report/download", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error downloading report");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reporte_proyectos.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      inputAlert("Download correctly", "success");
    } catch (error) {
      console.error("Error downloading report:", error);
      inputAlert("Error to download, try again...", "error");
    }
  };

  return (
    <div className="flex justify-around align-middle items-center text-center h-16 w-full pt-3 pb-2 bg-white">
      <h1 className="text-xl text-left font-bold w-2/5 pl-6">
        Dashboard de Proyectos
      </h1>
      <div className="flex gap-4 w-auto">
        <Button
          startIcon={<FileOpenIcon />}
          sx={{
            backgroundColor: "black",
            color: "white",
            fontSize: "12px",
            padding: "8px 20px",
          }}
          onClick={handleDownloadReport}
        >
          Descargar Reporte
        </Button>
        <Button
          startIcon={<ControlPointIcon />}
          sx={{
            backgroundColor: "black",
            color: "white",
            fontSize: "12px",
            padding: "8px 20px",
          }}
          onClick={handleOpen}
        >
          Nuevo Proyecto
        </Button>
      </div>
      <div className="flex gap-4 items-center w-auto">
        <Avatar
          alt="User Photo"
          src={session.user.photo}
          sx={{ width: 44, height: 44 }}
        />
        <h1>{session.user.name}</h1>
        <Tooltip title="Ajustes">
          <IconButton
            onClick={handleMenuClick}
            size="small"
            sx={{ ml: 0 }}
            aria-controls={openMenu ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? "true" : undefined}
          >
            <ArrowDropDownIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={openMenu}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleMenuClose}>
            <Avatar /> Perfil
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Avatar /> Mi cuenta
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <PersonAdd fontSize="small" />
            </ListItemIcon>
            Añadir otra cuenta
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Ajustes
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <a onClick={() => signOut({ callbackUrl: "/" })}>Cerrar Sesión</a>
          </MenuItem>
        </Menu>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <h2 id="modal-title">Nuevo Proyecto</h2>
          <TextField
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fecha de Inicio"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Fecha de Fin"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            fullWidth
            onClick={handleSubmit}
          >
            Crear Proyecto
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
