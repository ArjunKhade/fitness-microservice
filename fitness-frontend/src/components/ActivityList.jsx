import { Card, CardContent, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { getActivities } from '../services/api';

const ActivityList = () => {

  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  const fetchActivities = async () =>{
    try {
      const response = await getActivities();
      console.log(response)
      setActivities(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
   fetchActivities();
  },[])

  return (
    <div>
      <Grid container spacing={2}>
          {activities.map((act)=> (
            <Grid key={act.id}>
              <Card onClick={() => navigate(`/activities/${act.id}`)}>
                <CardContent>
                  <Typography variant='h6'>{act.type}</Typography>
                  <Typography >Duration: {act.duration}</Typography>
                  <Typography >Calories: {act.caloriesBurned}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </div>
  )
}

export default ActivityList