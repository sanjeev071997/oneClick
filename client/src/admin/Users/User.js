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
import { Delete, Person, Home } from '@mui/icons-material';
import { Divider, message } from 'antd';
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
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb"
        sx={{
          mb: 2,
          p: 1.5,
          backgroundColor: 'white', 
          borderRadius: 3, 
        }}>
        <Link
          component={RouterLink}
          to="/dashboard"
          underline="hover"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Home sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </Link>
        <Typography color="text.primary">Users</Typography>
      </Breadcrumbs>
      <Divider />

      <Typography variant="h4" gutterBottom sx={{
        fontWeight: 'bold',
        mb: 3,
        fontSize: { xs: '1.5rem', sm: '2rem' }
      }}>
        User Management
      </Typography>

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
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
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
                      onClick={() => handleDeleteUser(user._id)}
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