package com.fittness.activityservice.services;

import com.fittness.activityservice.dto.ActivityRequest;
import com.fittness.activityservice.dto.ActivityResponse;
import com.fittness.activityservice.model.Activity;
import com.fittness.activityservice.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final KafkaTemplate<String, Activity> kafkaTemplate;

    @Value("${kafka.topic.name}")
    private String topicName;

    public ActivityResponse trackActivity(ActivityRequest request) {

        boolean isValidUser = userValidationService.validateUser(request.getUserId());
        if(!isValidUser){
            throw new RuntimeException("Invalid user:"+request.getUserId());
        }
        Activity activity = Activity.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .duration(request.getDuration())
                .caloriesBurned(request.getCaloriesBurned())
                .startTime(request.getStartTime())
                .additionalMetrics(request.getAdditionalMetrics())
                .build();
        Activity savedActivity = activityRepository.save(activity);

        try {
            kafkaTemplate.send(topicName, savedActivity.getUserId(), savedActivity);
        } catch (Exception e) {
            e.printStackTrace();
        }


        return mapToResponse(savedActivity);

    }

    private ActivityResponse mapToResponse(Activity savedActivity) {
   ActivityResponse response = new ActivityResponse();
      response.setId(savedActivity.getId());
      response.setUserId(savedActivity.getUserId());
      response.setDuration(savedActivity.getDuration());
      response.setType(savedActivity.getType());
      response.setCaloriesBurned(savedActivity.getCaloriesBurned());
      response.setCreatedAt(savedActivity.getCreatedAt());
      response.setStartTime(savedActivity.getStartTime());
      response.setAdditionalMetrics(savedActivity.getAdditionalMetrics());
      response.setUpdatedAt(savedActivity.getUpdatedAt());
   return response;
    }
}
