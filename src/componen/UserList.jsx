import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Pagination,
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === "https:" ? "https" : "http";
  const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, "");
  return `${protocol}://${baseUrl}`;
};

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (currentPage = 1) => {
    try {
      const response = await axios.get(`${getApiBaseUrl()}/getuser`, {
        params: { page: currentPage, limit: 10 },
        withCredentials: true,
      });
      setUsers(response.data.data);
      setPage(currentPage);
      setTotalPages(response.data.meta.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
    fetchUsers(value);
  };
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const deleteUser = async(id) => {
    const userConfirm = window.confirm('Apakah anda ingin menghapus user ini?')
    if(userConfirm){
    try { 
      await axios.delete(`${getApiBaseUrl()}/deleteuser/${id}`, {
      withCredentials: true,
    });
    setSnackbar({ open: true, message: "user berhasil dihapus", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Gagal menghapus user", severity: "error" });
    }
  }
  }
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        User Management
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ mt: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              {/* <TableCell>Bookings</TableCell> */}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.role}</TableCell>
                {/* <TableCell>
                  {user.bokings.length > 0 ? (
                    <ul>
                      {user.bokings.map((booking) => (
                        <li key={booking.id}>
                          {`Wisata ID: ${booking.wisataId}, Tanggal: ${new Date(booking.tanggalBooking).toLocaleDateString()}, Status: ${booking.status}`}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "No bookings"
                  )}
                </TableCell> */}
                <TableCell>
                  <IconButton size="small" color="primary">
                    <EditIcon />
                  </IconButton>
                  {/* <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton> */}
                   <IconButton
                                        size="small"
                                        onClick={() => deleteUser(user.id)}
                                        sx={{
                                          color: "error.main",
                                          "&:hover": { backgroundColor: "error.lighter" },
                                        }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        sx={{ mt: 3, display: "flex", justifyContent: "center" }}
      />
    </Box>
  );
};

export default UsersManagement;
