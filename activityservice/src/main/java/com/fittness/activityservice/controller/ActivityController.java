package com.fittness.activityservice.controller;

import com.fittness.activityservice.dto.ActivityRequest;
import com.fittness.activityservice.dto.ActivityResponse;
import com.fittness.activityservice.services.ActivityService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/activities")
@AllArgsConstructor
public class ActivityController {

    private ActivityService activityService;

   @PostMapping
    public ResponseEntity<ActivityResponse> trackActivity(@RequestBody ActivityRequest request){
       return ResponseEntity.ok(activityService.trackActivity(request));
   }

}
