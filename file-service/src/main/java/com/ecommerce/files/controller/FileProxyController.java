package com.ecommerce.files.controller;

import com.ecommerce.files.service.MinioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

@RestController
@RequestMapping("/api/files")
public class FileProxyController {

    private final MinioService minioService;

    @Autowired
    public FileProxyController(MinioService minioService) {
        this.minioService = minioService;
    }

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
