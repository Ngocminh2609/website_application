package com.ecommerce.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import static com.ecommerce.backend.constant.service.GeminiAiServiceConstants.*;

/**
 * Service gọi Google Gemini API để sinh câu trả lời cho NovaBot.
 */
@Slf4j
@Service
public class GeminiAiService {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Value("${gemini.api-key:}")
    private String apiKey;

    @Value("${gemini.model:" + DEFAULT_MODEL + "}")
    private String model;

    @Value("${gemini.fallback-model:" + FALLBACK_MODEL + "}")
    private String fallbackModel;

    private final RestTemplate restTemplate;

    public GeminiAiService() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(CONNECT_TIMEOUT_MS);
        factory.setReadTimeout(READ_TIMEOUT_MS);
        this.restTemplate = new RestTemplate(factory);
    }

    @Getter
    public static class AiResult {
        private final String reply;
        private final boolean handoff;
        private final String error;

        private AiResult(String reply, boolean handoff, String error) {
            this.reply = reply;
            this.handoff = handoff;
            this.error = error;
        }

        public static AiResult ok(String reply, boolean handoff) {
            return new AiResult(reply, handoff, null);
        }

        public static AiResult fail(String reply, String error) {
            // Lỗi kỹ thuật → luôn escalate (handoff) sang admin
            return new AiResult(reply, true, error);
        }

        public boolean isEscalate() {
            return error != null;
        }
    }

    public AiResult generateReply(String userMessage) {
        if (!StringUtils.hasText(apiKey)) {
            log.warn(LOG_API_KEY_MISSING);
            return AiResult.fail(FALLBACK_REPLY, "GEMINI_API_KEY missing");
        }

        // Keyword nhanh: khách chủ động xin gặp người thật
        boolean forceHandoff = detectHandoffIntent(userMessage);

        Set<String> modelsToTry = new LinkedHashSet<>();
        modelsToTry.add(model);
        if (StringUtils.hasText(fallbackModel) && !fallbackModel.equals(model)) {
            modelsToTry.add(fallbackModel);
        }

        String lastError = null;
        boolean sawUnavailable = false;

        for (String modelId : modelsToTry) {
            for (int attempt = 1; attempt <= RETRY_MAX_ATTEMPTS; attempt++) {
                try {
                    if (attempt > 1) {
                        log.warn(LOG_RETRY, attempt, modelId);
                        Thread.sleep(RETRY_DELAY_MS * attempt);
                    } else if (!modelId.equals(model)) {
                        log.info(LOG_SWITCH_FALLBACK, modelId);
                    }

                    ParsedAiReply parsed = callGemini(modelId, userMessage);
                    if (parsed == null || !StringUtils.hasText(parsed.reply())) {
                        lastError = "Empty Gemini response from " + modelId;
                        log.warn(LOG_EMPTY_RESPONSE + " model={}", modelId);
                        break;
                    }
                    boolean handoff = forceHandoff || parsed.handoff();
                    return AiResult.ok(parsed.reply().trim(), handoff);
                } catch (HttpStatusCodeException e) {
                    lastError = e.getStatusCode() + " — " + e.getResponseBodyAsString();
                    log.error(LOG_CALL_FAILED, lastError);

                    if (e.getStatusCode().value() == 503) {
                        sawUnavailable = true;
                        continue;
                    }
                    if (e.getStatusCode().value() == 404 || e.getStatusCode().value() == 429) {
                        break;
                    }
                    return AiResult.fail(FALLBACK_REPLY, lastError);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    return AiResult.fail(FALLBACK_REPLY, "Interrupted");
                } catch (Exception e) {
                    lastError = e.getClass().getSimpleName() + ": " + e.getMessage();
                    log.error(LOG_CALL_FAILED, lastError, e);
                    break;
                }
            }
        }

        String userFacing = sawUnavailable ? BUSY_REPLY : FALLBACK_REPLY;
        return AiResult.fail(userFacing, lastError);
    }

    private ParsedAiReply callGemini(String modelId, String userMessage) throws Exception {
        String url = API_BASE_URL + modelId + GENERATE_CONTENT_SUFFIX;
        log.info(LOG_USING_MODEL, modelId);

        Map<String, Object> body = new HashMap<>();
        body.put("system_instruction", Map.of(
                "parts", List.of(Map.of("text", SYSTEM_PROMPT))
        ));
        body.put("contents", List.of(
                Map.of("parts", List.of(Map.of("text", userMessage)))
        ));
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("maxOutputTokens", 1024);
        generationConfig.put("thinkingConfig", Map.of("thinkingLevel", "minimal"));
        generationConfig.put("responseMimeType", "application/json");
        body.put("generationConfig", generationConfig);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", apiKey);

        ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                new HttpEntity<>(body, headers),
                Map.class
        );
        String raw = extractText(response.getBody());
        return parseAiJson(raw);
    }

    private ParsedAiReply parseAiJson(String raw) {
        if (!StringUtils.hasText(raw)) {
            return null;
        }
        String cleaned = raw.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceFirst("^```(?:json)?\\s*", "")
                    .replaceFirst("\\s*```$", "")
                    .trim();
        }
        try {
            JsonNode node = OBJECT_MAPPER.readTree(cleaned);
            String reply = node.path("reply").asText(null);
            boolean handoff = node.path("handoff").asBoolean(false);
            if (!StringUtils.hasText(reply)) {
                // Một số model trả {"message":...}
                reply = node.path("message").asText(cleaned);
            }
            return new ParsedAiReply(reply, handoff);
        } catch (Exception e) {
            log.warn(LOG_PARSE_JSON_FAILED, raw);
            boolean handoff = detectHandoffIntent(raw);
            return new ParsedAiReply(cleaned, handoff);
        }
    }

    /** Phát hiện ý định gặp tư vấn viên / hỏi dữ liệu cá nhân. */
    boolean detectHandoffIntent(String text) {
        if (!StringUtils.hasText(text)) {
            return false;
        }
        String lower = text.toLowerCase(Locale.ROOT);
        return lower.contains("tư vấn viên")
                || lower.contains("tu van vien")
                || lower.contains("gặp admin")
                || lower.contains("gap admin")
                || lower.contains("gặp người")
                || lower.contains("người thật")
                || lower.contains("nói chuyện với")
                || lower.contains("chat với nhân viên")
                || lower.contains("đơn hàng của tôi")
                || lower.contains("don hang cua toi")
                || lower.contains("đơn của tôi")
                || lower.contains("hoàn tiền")
                || lower.contains("trạng thái giao");
    }

    private String extractText(Map<String, Object> body) {
        if (body == null) {
            return null;
        }
        Object candidatesObj = body.get("candidates");
        if (!(candidatesObj instanceof List<?> candidates) || candidates.isEmpty()) {
            return null;
        }
        Object first = candidates.get(0);
        if (!(first instanceof Map<?, ?> candidate)) {
            return null;
        }
        Object contentObj = candidate.get("content");
        if (!(contentObj instanceof Map<?, ?> content)) {
            return null;
        }
        Object partsObj = content.get("parts");
        if (!(partsObj instanceof List<?> parts) || parts.isEmpty()) {
            return null;
        }

        List<String> texts = new ArrayList<>();
        for (Object partObj : parts) {
            if (!(partObj instanceof Map<?, ?> part)) {
                continue;
            }
            Object thought = part.get("thought");
            if (Boolean.TRUE.equals(thought)) {
                continue;
            }
            Object text = part.get("text");
            if (text != null && StringUtils.hasText(text.toString())) {
                texts.add(text.toString());
            }
        }
        if (texts.isEmpty()) {
            return null;
        }
        return String.join("", texts);
    }

    private record ParsedAiReply(String reply, boolean handoff) {}
}
