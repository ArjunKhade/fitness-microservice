import { Box, Card, CardContent, Divider, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getRecomendationByActivity } from '../services/api';

const ActivityDetails = () => {

    const {id} = useParams();
    const [activity, setActivity] = useState(null);
    const [recommendation, setRecommendation] = useState(null);

    const fetchActivities = async (id)=>{
        try {
            const response = await getRecomendationByActivity(id);
            console.log(response);
            
            setActivity(response.data);
            setRecommendation(response.data.recommendations);
        } catch (error) {
            console.log(error);
        }
      };
    
    useEffect( () => {
      fetchActivities(id);
    },[id])

    if(!activity){
        return <>Loading....</>
    }

  return (
    <div>
         <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>Activity Details</Typography>
                    <Typography>Type: {activity.type}</Typography>
                    <Typography>Duration: {activity.duration} minutes</Typography>
                    <Typography>Calories Burned: {activity.caloriesBurned}</Typography>
                    <Typography>Date: {new Date(activity.createdAt).toLocaleString()}</Typography>
                </CardContent>
            </Card>

            {recommendation && (
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>AI Recommendation</Typography>
                        <Typography variant="h6">Analysis</Typography>
                        <Typography paragraph>{activity.recommendations}</Typography>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="h6">Improvements</Typography>
                        {activity?.improvements?.map((improvement, index) => (
                            <Typography key={index} paragraph>• {activity.improvements}</Typography>
                        ))}
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="h6">Suggestions</Typography>
                        {activity?.suggestions?.map((suggestion, index) => (
                            <Typography key={index} paragraph>• {suggestion}</Typography>
                        ))}
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="h6">Safety Guidelines</Typography>
                        {activity?.safety?.map((safety, index) => (
                            <Typography key={index} paragraph>• {safety}</Typography>
                        ))}
                    </CardContent>
                </Card>
            )}
        </Box>
    </div>
  )
}

export default ActivityDetails