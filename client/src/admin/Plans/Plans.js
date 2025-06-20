import React, { useEffect, useState } from 'react';
import axios from '../../axiosInstance';
import {
  Container, TextField, Typography, Button, Box, MenuItem, IconButton,
  Stack, Paper, Modal, Tab, Tabs, Card, CardContent,
  LinearProgress, Tooltip, Breadcrumbs, Link as MUILink,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Chip, Divider, Avatar, Select
} from '@mui/material';
import { AddCircle, RemoveCircle, Edit, Delete, Add, CheckCircle } from '@mui/icons-material';
import { message, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';

const initialForm = {
  planName: '',
  planDescription: '',
  monthlyPlanPrice: '',
  annuallyPlanPrice: '',
  monthlyDuration: '',
  annuallyDuration: '',
  planStatus: '', 
  planFeatures: [''],
};

const planStatusOptions = ['Get Started', 'Coming Soon'];

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
    const payload = { 
      ...form, 
      monthlyPlanPrice: Number(form.monthlyPlanPrice),
      annuallyPlanPrice: Number(form.annuallyPlanPrice)
    };

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
      await axios.put('/api/v1/plans/status', { id, isActive: newStatus });
      setPlans(prev =>
        prev.map(plan =>
          plan._id === id ? { ...plan, isActive: newStatus } : plan
        )
      );
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
      monthlyPlanPrice: plan.monthlyPlanPrice,
      annuallyPlanPrice: plan.annuallyPlanPrice,
      monthlyDuration: plan.monthlyDuration || 'month',
      annuallyDuration: plan.annuallyDuration || 'year',
      planStatus: plan.planStatus || 'Get Started',
      planFeatures: plan.planFeatures,
    });
    setEditId(plan._id);
    setModalOpen(true);
  };

  const renderForm = (isModal = false) => (
    <Stack spacing={3}>
      {isModal && (
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: '#275559' }}>
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
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          }
        }}
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
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          }
        }}
      />

      <Box display="flex" gap={2}>
        <TextField
          label="Monthly Price (₹)"
          type="number"
          value={form.monthlyPlanPrice}
          onChange={e => handleChange('monthlyPlanPrice', e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            }
          }}
        />

        <TextField
          label="Annually Price (₹)"
          type="number"
          value={form.annuallyPlanPrice}
          onChange={e => handleChange('annuallyPlanPrice', e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            }
          }}
        />
      </Box>

      <Box display="flex" gap={2}>
        <TextField
          label="Monthly Duration"
          value={form.monthlyDuration}
          onChange={e => handleChange('monthlyDuration', e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            }
          }}
        />

        <TextField
          label="Annually Duration"
          value={form.annuallyDuration}
          onChange={e => handleChange('annuallyDuration', e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            }
          }}
        />
      </Box>

      <Box>
        <TextField
          select
          label="Plan Status"
          value={form.planStatus}
          onChange={e => handleChange('planStatus', e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            }
          }}
        >
          {planStatusOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>Features</Typography>
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
              <Tooltip title="Remove feature">
                <IconButton
                  onClick={() => removeFeature(index)}
                  disabled={form.planFeatures.length === 1}
                  color="error"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255, 0, 0, 0.08)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 0, 0, 0.12)'
                    }
                  }}
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
            sx={{
              alignSelf: 'flex-start',
              color: '#275559',
              '&:hover': {
                backgroundColor: 'rgba(39, 85, 89, 0.08)'
              }
            }}
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
            sx={{
              borderRadius: '8px',
              borderColor: '#275559',
              color: '#275559',
              '&:hover': {
                borderColor: '#1d4246'
              }
            }}
          >
            Cancel
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? null : <Add />}
          sx={{
            borderRadius: '8px',
            backgroundColor: '#275559',
            '&:hover': {
              backgroundColor: '#1d4246'
            }
          }}
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
        Plans
      </Typography>

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
        <MUILink
          component={Link}
          to="/dashboard"
          sx={{ color: "inherit", textDecoration: "none" }}
        >
          Dashboard
        </MUILink>
        <Typography sx={{ color: "primary.main" }}>Plans</Typography>
      </Breadcrumbs>

      <Card sx={{ mb: 4, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              height: 4,
              borderRadius: '4px 4px 0 0'
            }
          }}
        >
          <Tab label="Create Plan" sx={{ fontWeight: 600, py: 2 }} />
          <Tab label="Manage Plans" sx={{ fontWeight: 600, py: 2 }} />
        </Tabs>
      </Card>

      {activeTab === 0 && (
        <Card elevation={0} sx={{
          borderRadius: '12px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          mb: 4
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{
              mb: 3,
              fontWeight: 600,
              color: '#275559',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <AddCircle color="primary" /> Create New Subscription Plan
            </Typography>
            {renderForm()}
          </CardContent>
        </Card>
      )}

      {activeTab === 1 && (
        <Box>
          {fetching ? (
            <LinearProgress color="primary" sx={{ height: 4, borderRadius: 2 }} />
          ) : plans.length === 0 ? (
            <Paper sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <Typography color="textSecondary" variant="h6">
                No plans found. Create your first plan!
              </Typography>
              <Button
                variant="contained"
                onClick={() => setActiveTab(0)}
                sx={{
                  mt: 2,
                  borderRadius: '8px',
                  backgroundColor: '#275559',
                  '&:hover': {
                    backgroundColor: '#1d4246'
                  }
                }}
              >
                Create Plan
              </Button>
            </Paper>
          ) : (
            <Card sx={{
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              overflow: 'hidden'
            }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: '#275559' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#275559' }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#275559' }}>Monthly Price</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#275559' }}>Annually Price</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#275559' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#275559' }}>Plan Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#275559' }}>Features</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: '#275559' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {plans.map((plan) => (
                      <TableRow
                        key={plan._id}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(39, 85, 89, 0.03)'
                          }
                        }}
                      >
                        <TableCell sx={{ fontWeight: 500 }}>{plan.planName}</TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {plan.planDescription}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`₹${plan.monthlyPlanPrice}`}
                            color="primary"
                            size="small"
                            sx={{
                              fontWeight: 600,
                              backgroundColor: 'rgba(39, 85, 89, 0.1)',
                              color: '#275559'
                            }}
                          />
                          <Typography variant="caption" display="block" color="text.secondary">
                            {plan.monthlyDuration}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`₹${plan.annuallyPlanPrice}`}
                            color="primary"
                            size="small"
                            sx={{
                              fontWeight: 600,
                              backgroundColor: 'rgba(39, 85, 89, 0.1)',
                              color: '#275559'
                            }}
                          />
                          <Typography variant="caption" display="block" color="text.secondary">
                            {plan.annuallyDuration}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={plan.isActive}
                            onChange={(e) => handleStatusChange(plan._id, e.target.value)}
                            size="small"
                            sx={{
                              minWidth: 100,
                              '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none'
                              },
                              '& .MuiSelect-select': {
                                padding: '6px 32px 6px 12px'
                              }
                            }}
                          >
                            <MenuItem value={true}>True</MenuItem>
                            <MenuItem value={false}>false</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={plan.planStatus || 'Get Started'}
                            size="small"
                            color={plan.planStatus === 'Coming Soon' ? 'warning' : 'success'}
                            sx={{
                              textTransform: 'capitalize',
                              fontWeight: 500
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack spacing={0.5}>
                            {plan.planFeatures.slice(0, 3).map((f, idx) => (
                              <Box key={idx} display="flex" alignItems="center">
                                <Avatar sx={{
                                  width: 20,
                                  height: 20,
                                  mr: 1,
                                  backgroundColor: 'rgba(39, 85, 89, 0.1)',
                                  color: '#275559'
                                }}>
                                  <CheckCircle sx={{ fontSize: '0.8rem' }} />
                                </Avatar>
                                <Typography variant="body2">{f}</Typography>
                              </Box>
                            ))}
                            {plan.planFeatures.length > 3 && (
                              <Typography variant="caption" color="text.secondary">
                                +{plan.planFeatures.length - 3} more
                              </Typography>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Edit Plan">
                              <IconButton
                                onClick={() => openEditModal(plan)}
                                size="small"
                                sx={{
                                  backgroundColor: 'rgba(39, 85, 89, 0.1)',
                                  color: '#275559',
                                  '&:hover': {
                                    backgroundColor: 'rgba(39, 85, 89, 0.2)'
                                  }
                                }}
                              >
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
                                <IconButton
                                  size="small"
                                  sx={{
                                    backgroundColor: 'rgba(255, 0, 0, 0.08)',
                                    color: '#ff4444',
                                    '&:hover': {
                                      backgroundColor: 'rgba(255, 0, 0, 0.12)'
                                    }
                                  }}
                                >
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
            </Card>
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
            borderRadius: 3,
            p: 4,
            outline: 'none',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
        >
          {renderForm(true)}
        </Box>
      </Modal>
    </Container>
  );
};

export default AdminPlans;