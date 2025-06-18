// import React, { useEffect, useState } from 'react';
// import axios from '../../axiosInstance';
// import {
//   Container, TextField, Typography, Button, Box, Chip, MenuItem, IconButton,
//   Stack, Paper, Divider, Grid, CircularProgress
// } from '@mui/material';
// import { AddCircle, RemoveCircle, Delete, Edit } from '@mui/icons-material';
// import { Colors, FontWeight } from '../../Comman';

// const AdminPlans = () => {
//   const [plans, setPlans] = useState([]);
//   const [planData, setPlanData] = useState({
//     planName: '',
//     planDescription: '',
//     planPrice: '',
//     planDuration: '',
//     planFeatures: [''],
//   });
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   const durations = ['monthly', 'quarterly', 'yearly'];

//   const getPlans = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get("/api/v1/plans/all");

//       const plansArray = Array.isArray(response.data)
//         ? response.data
//         : response.data.plans || response.data.data || [];

//       const formattedPlans = plansArray.map((plan) => ({
//         _id: plan._id,
//         planName: plan.planName,
//         planPrice: plan.planPrice === 0 ? "0" : plan.planPrice,
//         planDuration: plan.planDuration === "monthly" ? "per month" : plan.planDuration,
//         planDescription: plan.planDescription,
//         planFeatures: plan.planFeatures,
//         popular: plan.planName.toLowerCase() === "growth",
//       }));

//       setPlans(formattedPlans);
//     } catch (error) {
//       console.error("Error fetching plans:", error);
//       setPlans([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getPlans();
//   }, []);

//   const handleChange = (field, value) => {
//     setPlanData({ ...planData, [field]: value });
//   };

//   const handleFeatureChange = (index, value) => {
//     const updated = [...planData.planFeatures];
//     updated[index] = value;
//     setPlanData({ ...planData, planFeatures: updated });
//   };

//   const addFeature = () => {
//     setPlanData({ ...planData, planFeatures: [...planData.planFeatures, ''] });
//   };

//   const removeFeature = (index) => {
//     const updated = planData.planFeatures.filter((_, i) => i !== index);
//     setPlanData({ ...planData, planFeatures: updated });
//   };

//   const resetForm = () => {
//     setPlanData({
//       planName: '',
//       planDescription: '',
//       planPrice: '',
//       planDuration: '',
//       planFeatures: [''],
//     });
//     setEditId(null);
//     setMessage('');
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setMessage('');
//     const payload = { ...planData, planPrice: Number(planData.planPrice) };

//     try {
//       if (editId) {
//         await axios.put('/api/v1/plans/update', { ...payload, id: editId }); 

//         setMessage('✅ Plan updated successfully!');
//       } else {
//         await axios.post('/api/v1/plans/create', payload);
//         setMessage('✅ Plan created successfully!');
//       }
//       resetForm();
//       getPlans();
//     } catch (err) {
//       console.error('Error saving plan:', err);
//       setMessage('❌ Failed to save plan.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (plan) => {
//     setPlanData({
//       planName: plan.planName,
//       planDescription: plan.planDescription,
//       planPrice: plan.planPrice,
//       planDuration: plan.planDuration === 'per month' ? 'monthly' : plan.planDuration,
//       planFeatures: plan.planFeatures,
//     });
//     setEditId(plan._id);
//     setMessage('');
//   };

//   const handleDelete = async (planId ) => {
//     if (!window.confirm('Are you sure you want to delete this plan?')) return;
//     try {
//       await axios.delete('/api/v1/plans/delete', 
//         {data: { id:planId } ,
//     });
//       setMessage('✅ Plan deleted successfully!');
//       getPlans();
//     } catch (err) {
//       console.error('Error deleting plan:', err);
//       setMessage('❌ Failed to delete plan.');
//     }
//   };

//   return (
//     <Container sx={{ mt: 4, mb: 6 }}>
//       <Box textAlign="center" mb={4}>
//         <Chip label="Admin Panel" color="primary" variant="outlined" />
//         <Typography variant="h4" sx={{ mt: 2, fontWeight: FontWeight.heading2, color: Colors.darkText }}>
//           {editId ? 'Edit Plan' : 'Add New Plan'}
//         </Typography>
//       </Box>

//       <Paper sx={{ p: 4, mb: 6 }}>
//         <Stack spacing={3}>
//           <TextField label="Plan Name" value={planData.planName} onChange={(e) => handleChange('planName', e.target.value)} fullWidth required />
//           <TextField label="Plan Description" value={planData.planDescription} onChange={(e) => handleChange('planDescription', e.target.value)} fullWidth multiline rows={2} required />
//           <TextField label="Plan Price (₹)" type="number" value={planData.planPrice} onChange={(e) => handleChange('planPrice', e.target.value)} fullWidth required />
//           <TextField select label="Duration" value={planData.planDuration} onChange={(e) => handleChange('planDuration', e.target.value)} fullWidth required>
//             {durations.map((duration) => <MenuItem key={duration} value={duration}>{duration}</MenuItem>)}
//           </TextField>

//           <Box>
//             <Typography variant="subtitle1" sx={{ mb: 1 }}>Plan Features</Typography>
//             {planData.planFeatures.map((feature, index) => (
//               <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                 <TextField label={`Feature ${index + 1}`} value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} fullWidth />
//                 <IconButton onClick={() => removeFeature(index)} disabled={planData.planFeatures.length === 1} color="error">
//                   <RemoveCircle />
//                 </IconButton>
//               </Box>
//             ))}
//             <Button onClick={addFeature} variant="outlined" startIcon={<AddCircle />} sx={{ mt: 1 }}>
//               Add Feature
//             </Button>
//           </Box>

//           <Button variant="contained" color="primary" size="large" onClick={handleSubmit} disabled={loading}>
//             {loading ? 'Saving...' : editId ? 'Update Plan' : 'Create Plan'}
//           </Button>

//           {message && <Typography sx={{ color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</Typography>}
//         </Stack>
//       </Paper>

//       <Typography variant="h5" gutterBottom>All Plans</Typography>

//       {loading ? (
//         <CircularProgress />
//       ) : (
//         <Grid container spacing={2}>
//           {plans.map((plan) => (
//             <Grid item xs={12} md={6} key={plan._id}>
//               <Paper sx={{ p: 3 }}>
//                 <Typography variant="h6">{plan.planName} ({plan.planDuration})</Typography>
//                 <Typography variant="body2" sx={{ mb: 1 }}>{plan.planDescription}</Typography>
//                 <Typography variant="subtitle1" sx={{ mb: 1 }}>₹ {plan.planPrice}</Typography>
//                 <Typography variant="subtitle2">Features:</Typography>
//                 <ul>
//                   {plan.planFeatures.map((f, i) => <li key={i}>{f}</li>)}
//                 </ul>
//                 <Divider sx={{ my: 2 }} />
//                 <Stack direction="row" spacing={1}>
//                   <Button variant="outlined" onClick={() => handleEdit(plan)} startIcon={<Edit />}>Edit</Button>
//                   <Button variant="outlined" color="error" onClick={() => handleDelete(plan._id)} startIcon={<Delete />}>Delete</Button>
//                 </Stack>
//               </Paper>
//             </Grid>
//           ))}
//         </Grid>
//       )}
//     </Container>
//   );
// };

// export default AdminPlans;

import React, { useEffect, useState } from 'react';
import axios from '../../axiosInstance';
import {
  Container, TextField, Typography, Button, Box, Chip, MenuItem, IconButton,
  Stack, Paper, Divider, Grid, CircularProgress
} from '@mui/material';
import { AddCircle, RemoveCircle, Delete, Edit } from '@mui/icons-material';
import { Colors, FontWeight } from '../../Comman';

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [planData, setPlanData] = useState({
    planName: '',
    planDescription: '',
    planPrice: '',
    planDuration: '',
    planFeatures: [''],
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);         // for form
  const [plansLoading, setPlansLoading] = useState(false); // for plans list
  const [message, setMessage] = useState('');

  const durations = ['monthly', 'quarterly', 'yearly'];

  const getPlans = async () => {
    setPlansLoading(true);
    try {
      const response = await axios.get("/api/v1/plans/all");

      const plansArray = Array.isArray(response.data)
        ? response.data
        : response.data.plans || response.data.data || [];

      const formattedPlans = plansArray.map((plan) => ({
        _id: plan._id,
        planName: plan.planName,
        planPrice: plan.planPrice === 0 ? "0" : plan.planPrice,
        planDuration: plan.planDuration === "monthly" ? "per month" : plan.planDuration,
        planDescription: plan.planDescription,
        planFeatures: plan.planFeatures,
        popular: plan.planName.toLowerCase() === "growth",
      }));

      setPlans(formattedPlans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      setPlans([]);
    } finally {
      setPlansLoading(false);
    }
  };

  useEffect(() => {
    getPlans();
  }, []);

  const handleChange = (field, value) => {
    setPlanData({ ...planData, [field]: value });
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...planData.planFeatures];
    updated[index] = value;
    setPlanData({ ...planData, planFeatures: updated });
  };

  const addFeature = () => {
    setPlanData({ ...planData, planFeatures: [...planData.planFeatures, ''] });
  };

  const removeFeature = (index) => {
    const updated = planData.planFeatures.filter((_, i) => i !== index);
    setPlanData({ ...planData, planFeatures: updated });
  };

  const resetForm = () => {
    setPlanData({
      planName: '',
      planDescription: '',
      planPrice: '',
      planDuration: '',
      planFeatures: [''],
    });
    setEditId(null);
    setMessage('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    const payload = { ...planData, planPrice: Number(planData.planPrice) };

    try {
      if (editId) {
        await axios.put('/api/v1/plans/update', { ...payload, id: editId }); 
        setMessage('✅ Plan updated successfully!');
      } else {
        await axios.post('/api/v1/plans/create', payload);
        setMessage('✅ Plan created successfully!');
      }
      resetForm();
      getPlans();
    } catch (err) {
      console.error('Error saving plan:', err);
      setMessage('❌ Failed to save plan.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setPlanData({
      planName: plan.planName,
      planDescription: plan.planDescription,
      planPrice: plan.planPrice,
      planDuration: plan.planDuration === 'per month' ? 'monthly' : plan.planDuration,
      planFeatures: plan.planFeatures,
    });
    setEditId(plan._id);
    setMessage('');
  };

  const handleDelete = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await axios.delete('/api/v1/plans/delete', {
        data: { id: planId },
      });

      // Immediately update UI
      setPlans((prev) => prev.filter((p) => p._id !== planId));

      setMessage('✅ Plan deleted successfully!');
    } catch (err) {
      console.error('Error deleting plan:', err);
      setMessage('❌ Failed to delete plan.');
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Box textAlign="center" mb={4}>
        <Chip label="Admin Panel" color="primary" variant="outlined" />
        <Typography variant="h4" sx={{ mt: 2, fontWeight: FontWeight.heading2, color: Colors.darkText }}>
          {editId ? 'Edit Plan' : 'Add New Plan'}
        </Typography>
      </Box>

      <Paper sx={{ p: 4, mb: 6 }}>
        <Stack spacing={3}>
          <TextField label="Plan Name" value={planData.planName} onChange={(e) => handleChange('planName', e.target.value)} fullWidth required />
          <TextField label="Plan Description" value={planData.planDescription} onChange={(e) => handleChange('planDescription', e.target.value)} fullWidth multiline rows={2} required />
          <TextField label="Plan Price (₹)" type="number" value={planData.planPrice} onChange={(e) => handleChange('planPrice', e.target.value)} fullWidth required />
          <TextField select label="Duration" value={planData.planDuration} onChange={(e) => handleChange('planDuration', e.target.value)} fullWidth required>
            {durations.map((duration) => <MenuItem key={duration} value={duration}>{duration}</MenuItem>)}
          </TextField>

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Plan Features</Typography>
            {planData.planFeatures.map((feature, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField label={`Feature ${index + 1}`} value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} fullWidth />
                <IconButton onClick={() => removeFeature(index)} disabled={planData.planFeatures.length === 1} color="error">
                  <RemoveCircle />
                </IconButton>
              </Box>
            ))}
            <Button onClick={addFeature} variant="outlined" startIcon={<AddCircle />} sx={{ mt: 1 }}>
              Add Feature
            </Button>
          </Box>

          <Button variant="contained" color="primary" size="large" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : editId ? 'Update Plan' : 'Create Plan'}
          </Button>

          {message && <Typography sx={{ color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</Typography>}
        </Stack>
      </Paper>

      <Typography variant="h5" gutterBottom>All Plans</Typography>

      {plansLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {plans.map((plan) => (
            <Grid item xs={12} md={6} key={plan._id}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6">{plan.planName} ({plan.planDuration})</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>{plan.planDescription}</Typography>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>₹ {plan.planPrice}</Typography>
                <Typography variant="subtitle2">Features:</Typography>
                <ul>
                  {plan.planFeatures.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" onClick={() => handleEdit(plan)} startIcon={<Edit />}>Edit</Button>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(plan._id)} startIcon={<Delete />}>Delete</Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AdminPlans;

