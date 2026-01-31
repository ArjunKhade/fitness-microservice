import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useState } from 'react'
import { addActivities } from '../services/api'

const ActivityForm = ({onActivityAdded}) => {

    const [activity, setActivity]= useState({
        type: "RUNNING", duration: '', caloriesBurned: '', 
        additionalMetrics: {}
    })

    const handleSubmit = async (e) =>{
       e.preventDefault();
       try {
        //api call add activity
        await addActivities(activity);
        onActivityAdded();
        setActivity({
           type: "RUNNING", duration: '', caloriesBurned: '', 
        additionalMetrics: {}
        })
       } catch (error) {
        console.log(error);
        
       }
    }

  return (

    <div>
      <Box component="form" onSubmit={handleSubmit}>
        <FormControl fullWidth style={{ marginBottom: '16px' }}>
          <InputLabel id="demo-simple-select-label">Activity Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="ActivityType"
            value={activity.type}
            label="Activity Type"
            onChange={(e) => { setActivity({...activity, type: e.target.value})}}
          >
            <MenuItem value={'RUNNING'}>Running</MenuItem>
            <MenuItem value={'WALKING'}>Walking</MenuItem>
            <MenuItem value={'CYCLING'}>Cycling</MenuItem>
          </Select>
        </FormControl>

        <TextField fullWidth style={{ marginBottom: '16px' }}
         id="Duration" 
         type='number' 
         label="Duration" 
         variant="outlined"
         onChange={(e) =>{setActivity({...activity, duration: e.target.value})}} />

        <TextField fullWidth style={{ marginBottom: '16px' }} 
        id="CaloriesBurned" 
        type='text' 
        label="Calories Burned" 
        variant="outlined"
        onChange={(e) =>{setActivity({...activity, caloriesBurned: e.target.value})}} />

        <Button type='submit' variant='contained' >Add Activity</Button>
      </Box>
    </div>
  );
}

export default ActivityForm