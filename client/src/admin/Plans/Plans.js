import React, { useEffect, useState } from 'react';
import axios from '../../axiosInstance';
import {
  Container, TextField, Typography, Button, Box, MenuItem, IconButton,
  Stack, Paper, Modal, Tab, Tabs, Card, CardContent,
   LinearProgress, Tooltip, Breadcrumbs, Link as MUILink,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress
} from '@mui/material';
import { AddCircle, RemoveCircle, Edit, Delete, Add } from '@mui/icons-material';
import { message, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';

const durations = ['monthly', 'quarterly', 'yearly'];

const initialForm = {
  planName: '',
  planDescription: '',
  planPrice: '',
  planDuration: '',
  planFeatures: [''],
};

const AdminPlans = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const getPlans = async () => {
    setFetching(true);
    try {
      const res = await axios.get('/api/v1/plans/all/admin');
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.plans || res.data.data || [];
      setPlans(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    getPlans();
  }, []);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (i, val) => {
    const features = [...form.planFeatures];
    features[i] = val;
    setForm(prev => ({ ...prev, planFeatures: features }));
  };

  const addFeature = () => {
    setForm(prev => ({ ...prev, planFeatures: [...prev.planFeatures, ''] }));
  };

  const removeFeature = (i) => {
    const updated = form.planFeatures.filter((_, index) => index !== i);
    setForm(prev => ({ ...prev, planFeatures: updated }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
    setModalOpen(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const payload = { ...form, planPrice: Number(form.planPrice) };

    try {
      if (editId) {
        await axios.put('/api/v1/plans/update', { ...payload, id: editId });
        message.success('Plan updated successfully!');
      } else {
        await axios.post('/api/v1/plans/create', payload);
        message.success('Plan created successfully!');
      }

      resetForm();
      getPlans();
      if (!editId) setActiveTab(1);
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || 'Failed to save plan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/v1/plans/delete', { data: { id } });
      setPlans(prev => prev.filter(p => p._id !== id));
      message.success('Plan deleted successfully!');
    } catch (err) {
      console.error(err);
      message.error('Failed to delete plan');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
       await axios.put('/api/v1/plans/status', {
        id,
      });
      setPlans(prev =>
        prev.map(plan =>
          plan._id === id ? { ...plan, status: newStatus } : plan
        )
      );
      getPlans()
      message.success('Plan status updated!');
    } catch (err) {
      console.error(err);
      message.error('Failed to update status');
    }
  };

  const openEditModal = (plan) => {
    setForm({
      planName: plan.planName,
      planDescription: plan.planDescription,
      planPrice: plan.planPrice,
      planDuration: plan.planDuration,
      planFeatures: plan.planFeatures,
    });
    setEditId(plan._id);
    setModalOpen(true);
  };

  const renderForm = (isModal = false) => (
    <Stack spacing={3}>
      {isModal && (
        <Typography variant="h6" component="h2">
          {editId ? 'Edit Plan' : 'Create New Plan'}
        </Typography>
      )}

      <TextField
        label="Plan Name"
        value={form.planName}
        onChange={e => handleChange('planName', e.target.value)}
        fullWidth
        variant="outlined"
        size="small"
      />

      <TextField
        label="Description"
        value={form.planDescription}
        onChange={e => handleChange('planDescription', e.target.value)}
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        size="small"
      />

      <Box display="flex" gap={2}>
        <TextField
          label="Price (₹)"
          type="number"
          value={form.planPrice}
          onChange={e => handleChange('planPrice', e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
        />

        <TextField
          select
          label="Duration"
          value={form.planDuration}
          onChange={e => handleChange('planDuration', e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
        >
          {durations.map(duration => (
            <MenuItem key={duration} value={duration}>
              {duration.charAt(0).toUpperCase() + duration.slice(1)}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>Features</Typography>
        <Stack spacing={1}>
          {form.planFeatures.map((feature, index) => (
            <Box key={index} display="flex" alignItems="center" gap={1}>
              <TextField
                fullWidth
                label={`Feature ${index + 1}`}
                value={feature}
                onChange={e => handleFeatureChange(index, e.target.value)}
                variant="outlined"
                size="small"
              />
              <Tooltip title="Remove feature">
                <IconButton
                  onClick={() => removeFeature(index)}
                  disabled={form.planFeatures.length === 1}
                  color="error"
                  size="small"
                >
                  <RemoveCircle fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
          <Button
            onClick={addFeature}
            startIcon={<AddCircle fontSize="small" />}
            size="small"
            sx={{ alignSelf: 'flex-start' }}
          >
            Add Feature
          </Button>
        </Stack>
      </Box>

      <Box display="flex" justifyContent="flex-end" gap={2} pt={2}>
        {isModal && (
          <Button
            variant="outlined"
            onClick={() => setModalOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? null : <Add />}
        >
          {loading ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              {editId ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            editId ? 'Update Plan' : 'Create Plan'
          )}
        </Button>
      </Box>
    </Stack>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" align="center" gutterBottom sx={{ mb: 3 }}>
        Plans
      </Typography>

      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 5 }}>
        <MUILink component={Link} to="/dashboard" sx={{ color: 'inherit' }}>
          Dashboard
        </MUILink>
        <Typography color="primary">Plans</Typography>
      </Breadcrumbs>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="Create Plan" />
        <Tab label="Manage Plans" />
      </Tabs>

      {activeTab === 0 && (
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Create New Subscription Plan
            </Typography>
            {renderForm()}
          </CardContent>
        </Card>
      )}

      {activeTab === 1 && (
        <Box>
          {fetching ? (
            <LinearProgress />
          ) : plans.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="textSecondary">
                No plans found. Create your first plan!
              </Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: '#275559' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white' }}>Name</TableCell>
                    <TableCell sx={{ color: 'white' }}>Description</TableCell>
                    <TableCell sx={{ color: 'white' }}>Price</TableCell>
                    <TableCell sx={{ color: 'white' }}>Duration</TableCell>
                    <TableCell sx={{ color: 'white' }}>Features</TableCell>
                    <TableCell sx={{ color: 'white' }}>Status</TableCell>
                    <TableCell align="right" sx={{ color: 'white' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan._id}>
                      <TableCell>{plan.planName}</TableCell>
                      <TableCell>{plan.planDescription}</TableCell>
                      <TableCell>₹{plan.planPrice}</TableCell>
                      <TableCell>{plan.planDuration}</TableCell>
                      <TableCell>
                        <Box component="ul" sx={{ pl: 2 }}>
                          {plan.planFeatures.map((f, idx) => (
                            <li key={idx}>
                              <Typography variant="body2">{f}</Typography>
                            </li>
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <TextField
                          select
                          value={plan.isActive ? 'true' : 'false'}
                          onChange={(e) =>
                            handleStatusChange(plan._id, e.target.value === 'true')
                          }
                          size="small"
                        >
                          <MenuItem value="true">True</MenuItem>
                          <MenuItem value="false">False</MenuItem>
                        </TextField>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Edit Plan">
                            <IconButton color="primary" onClick={() => openEditModal(plan)} size="small">
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Popconfirm
                            title="Delete this plan?"
                            description="This action cannot be undone."
                            onConfirm={() => handleDelete(plan._id)}
                            okText="Delete"
                            cancelText="Cancel"
                          >
                            <Tooltip title="Delete Plan">
                              <IconButton color="error" size="small">
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Popconfirm>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      <Modal
        open={modalOpen}
        onClose={() => !loading && setModalOpen(false)}
        aria-labelledby="edit-plan-modal"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '80%', md: 600 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            outline: 'none'
          }}
        >
          {renderForm(true)}
        </Box>
      </Modal>
    </Container>
  );
};

export default AdminPlans;
