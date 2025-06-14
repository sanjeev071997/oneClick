import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  TextField,
  Breadcrumbs,
  Link,
  TablePagination,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import axios from '../../axiosInstance';
import moment from 'moment';
import { Divider, message, Modal } from 'antd';
const { confirm } = Modal;

const AdminContact = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/v1/contact/get');
      setContacts(data.contact || []);
      setFilteredContacts(data.contact || []);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: 'Are you sure you want to delete this contact?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete('/api/v1/contact/delete', { data: { id } });
          const updated = contacts.filter(contact => contact._id !== id);
          setContacts(updated);
          setFilteredContacts(updated);
          message.success('Contact deleted successfully');
        } catch (err) {
          message.error(err.response?.data?.message || 'Failed to delete contact');
        }
      }
    });
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContacts(filtered);
      setPage(0);
    }
  }, [searchTerm, contacts]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
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
     
             <Typography sx={{ color: "primary.main" }}>Contact</Typography>
           </Breadcrumbs>
           <Divider />

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Contacts
        </Typography>
      </Box>
      {/* Search */}
      <Box sx={{ mb: 3 }}>
      <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by Categories Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <IconButton>
                <SearchIcon sx={{ color: "#1976d2" }} />
              </IconButton>
            ),
          }}
          sx={{
            mb: 3,
            mt: 2,
            bgcolor: "white",
            borderRadius: "20px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
              },
              "&:hover fieldset": {
                border: "none",
              },
              "&.Mui-focused fieldset": {
                border: "none",
              },
            },
          }}
        />
      </Box>

      {/* Content */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : filteredContacts.length === 0 ? (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">
            {searchTerm ? 'No matching contacts found' : 'No contact submissions found'}
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: 'white' }}>S.No</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'white' }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'white' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'white' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'white' }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'white' }}>Message</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'white' }}>Submitted At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredContacts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((contact, index) => (
                    <TableRow
                      key={contact._id}
                      hover
                      sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}
                    >
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => showDeleteConfirm(contact._id)}
                            color="error"
                            aria-label="delete"
                            sx={{
                              '&:hover': {
                                backgroundColor: theme.palette.error.light,
                                color: theme.palette.error.dark
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.phone || '-'}</TableCell>
                      <TableCell sx={{
                        maxWidth: 300,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {contact.message}
                      </TableCell>
                      <TableCell>
                        {moment(contact.createdAt).format('MMM D, YYYY h:mm A')}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredContacts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
          />
        </Paper>
      )}
    </Box>
  );
};

export default AdminContact;
