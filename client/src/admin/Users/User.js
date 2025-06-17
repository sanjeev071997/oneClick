import React, { useState, useEffect } from 'react';
import axios from '../../axiosInstance';
import {
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
  Box,
  Button,
  Breadcrumbs,
  Link
} from '@mui/material';
import { Delete, Person } from '@mui/icons-material';
import { Divider, message, Modal } from 'antd';
import { Link as RouterLink } from 'react-router-dom';

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/auth/admin/get');
      console.log("API Response:", res.data);
      setUsers(res.data.adminUsers || []);
    } catch (err) {
      message.error('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete('/api/v1/auth/admin/delete', {
        data: { id }
      });
      message.success('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      message.error('Failed to delete user. Please try again.');
      console.error('Error deleting user:', err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh'
      }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{
      marginTop: '2rem',
      marginBottom: '2rem',
      padding: { xs: '0.5rem', sm: '1rem' }
    }}>
      <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{
                mb: 3,
                fontFamily: "Poppins, sans-serif",
                color: "#2C3E50",
                letterSpacing: "2.5px",
                lineHeight: 1.8,
              }}
            >
            User Management
            </Typography>
      {/* Breadcrumbs */}
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          mb: 5,
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Link
          component={RouterLink}
          to="/dashboard"
          sx={{ color: "inherit", textDecoration: "none" }}
        >
          Dashboard
        </Link>
        <Typography sx={{ color: "primary.main" }}>Users</Typography>
      </Breadcrumbs>

      <Divider />

      <Paper elevation={3} sx={{
        p: { xs: 1, sm: 3 },
        borderRadius: 2,
        overflowX: 'auto'
      }}>
        {users.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', p: 3 }}>
            No users found.
          </Typography>
        ) : (
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>S.No</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Joined</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow
                  key={user._id}
                  sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                        {user.name?.charAt(0) || <Person />}
                      </Avatar>
                      <Typography variant="body2">
                        {user.name || 'Anonymous'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || 'N/A'}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Delete />}
                      onClick={() => {
                        Modal.confirm({
                          title: 'Are you sure you want to delete this user?',
                          content: 'This action cannot be undone.',
                          okText: 'Yes, Delete',
                          okType: 'danger',
                          cancelText: 'Cancel',
                          onOk: () => handleDeleteUser(user._id),
                        });
                      }}
                      sx={{ textTransform: 'none' }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
};

export default UserDashboard;
