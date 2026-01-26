package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {

    private final GeminiService geminiService;

    public Recommendation generateRecommendations(Activity activity){
        String prompt = createPromtForActivity(activity);
        String aiResponse = geminiService.getRecommendations(prompt);
        log.info("RESPONSE FROM AI {}", aiResponse);
        return processAiResponse(aiResponse, activity);


    }

    private Recommendation processAiResponse(String aiResponse, Activity activity) {

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(aiResponse);
            JsonNode textNode = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .get("parts")
                    .get(0)
                    .path("text");

            String jsonContent = textNode.asText()
                    .replaceAll("```json\\n","")
                    .replaceAll("\\n```","")
                    .trim();
            log.info("CLEAN RESPONSE FROM AI {}", jsonContent);

            JsonNode analysisJson = mapper.readTree(jsonContent);
            JsonNode analysisNode = analysisJson.path("analysis");
            StringBuilder fullAnalysis = new StringBuilder();

            addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall:");
            addAnalysisSection(fullAnalysis, analysisNode, "pace", "Pace:");
            addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "Heart Rate:");
            addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "Calories:");

            List<String> improvements = extractImprovements(analysisJson.path("improvements"));
            List<String> suggetions = extractSuggetions(analysisJson.path("suggestions"));
            List<String> safety = extractSafety(analysisJson.path("safety"));

           return  Recommendation.builder()
                   .activityId(activity.getId())
                   .userId(activity.getUserId())
                   .type(activity.getType().toString())
                   .recommendations(fullAnalysis.toString().trim())
                   .improvements(improvements)
                   .suggestions(suggetions)
                   .safety(safety)
                   .createdAt(LocalDateTime.now())
                   .build();


        } catch (Exception e) {
            e.printStackTrace();
            return createDefaultRecommendation(activity);
        }

    }

    private Recommendation createDefaultRecommendation(Activity activity) {
       return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .type(activity.getType().toString())
                .recommendations("Unable to generate detailed analysis")
                .improvements(Collections.singletonList("Continue with your current routine"))
                .suggestions(Collections.singletonList("Consider consulting a fitness consultant"))
                .safety(Arrays.asList("Always warm up before exercise", "Stay hydrated", "Listen to your body"))
                .createdAt(LocalDateTime.now())
                .build();

    }

    private List<String> extractSafety(JsonNode safetyNode) {
        List<String> safeyList = new ArrayList<>();

        if(safetyNode.isArray()){
            safetyNode.forEach(safety -> safeyList.add(safety.asText()));
        }
        return safeyList.isEmpty()? Collections.singletonList("Follow general safety guidelines")
                : safeyList;
    }

    private List<String> extractSuggetions(JsonNode suggestionsNode) {
        List<String> suggestionList = new ArrayList<>();

        if(suggestionsNode.isArray()){
            suggestionsNode.forEach(suggestion -> {
                String workout = suggestion.path("workout").asText();
                String description = suggestion.path("description").asText();
                suggestionList.add(String.format("%s: %s",workout, description));
            });
        }
        return suggestionList.isEmpty()? Collections.singletonList("No specific suggestions provided")
                : suggestionList;
    }

    private List<String> extractImprovements(JsonNode improvementNode) {
    List<String> improvementsList = new ArrayList<>();

    if(improvementNode.isArray()){
        improvementNode.forEach(improvement -> {
            String area = improvement.path("area").asText();
            String recommendation = improvement.path("recommendation").asText();
            improvementsList.add(String.format("%s: %s",area, recommendation));
        });
    }
    return improvementsList.isEmpty()? Collections.singletonList("No specific improvements provided")
            : improvementsList;
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
        if(!analysisNode.path(key).isMissingNode()){
            fullAnalysis.append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }


    }


    private String createPromtForActivity(Activity activity) {
        return String.format("""
        Analyze this fitness activity and provide detailed recommendations in the following EXACT JSON format:
        {
          "analysis": {
            "overall": "Overall analysis here",
            "pace": "Pace analysis here",
            "heartRate": "Heart rate analysis here",
            "caloriesBurned": "Calories analysis here"
          },
          "improvements": [
            {
              "area": "Area name",
              "recommendation": "Detailed recommendation"
            }
          ],
          "suggestions": [
            {
              "workout": "Workout name",
              "description": "Detailed workout description"
            }
          ],
          "safety": [
            "Safety point 1",
            "Safety point 2"
          ]
        }

        Analyze this activity:
        Activity Type: %s
        Duration: %d minutes
        Calories Burned: %d
        Additional Metrics: %s
        
        Provide detailed analysis focusing on performance, improvements, next workout suggestions, and safety guidelines.
        Ensure the response follows the EXACT JSON format shown above.
        """,
                activity.getType(),
                activity.getDuration(),
                activity.getCaloriesBurned(),
                activity.getAdditionalMetrics()
        );

    }
}
