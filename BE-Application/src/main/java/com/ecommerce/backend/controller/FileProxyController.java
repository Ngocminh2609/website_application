package com.ecommerce.backend.controller;

import com.ecommerce.backend.service.MinioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

/**
 * Tach proxy endpoint ra controller rieng vi FileUploadController co prefix /api/upload,
 * nen neu de chung thi URL thuc te se la /api/upload/api/files/... thay vi /api/files/...
 */
@RestController
@RequestMapping("/api/files")
public class FileProxyController {

    private final MinioService minioService;

    @Autowired
    public FileProxyController(MinioService minioService) {
        this.minioService = minioService;
    }

    /**
     * Proxy anh tu MinIO/B2 ve browser de giai quyet van de bucket Private.
     * Browser goi endpoint nay, BE tu xac thuc voi B2 va tra file ve, FE khong can biet storage credentials.
     */
    @GetMapping("/{bucket}/{objectName}")
    public ResponseEntity<StreamingResponseBody> proxyFile(
            @PathVariable String bucket,
            @PathVariable String objectName) {
        try {
            ResponseInputStream<GetObjectResponse> objectResponse = minioService.getObject(bucket, objectName);
            String contentType = objectResponse.response().contentType();
            MediaType mediaType = contentType != null ? MediaType.parseMediaType(contentType) : MediaType.APPLICATION_OCTET_STREAM;

            StreamingResponseBody body = outputStream -> {
                objectResponse.transferTo(outputStream);
                objectResponse.close();
            };

            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                    .contentType(mediaType)
                    .body(body);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
