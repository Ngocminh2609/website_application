package com.ecommerce.files.controller;

import com.ecommerce.files.service.MinioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/files")
public class FileProxyController {

    private final MinioService minioService;
    private final Set<String> allowedBuckets;

    @Autowired
    public FileProxyController(
            MinioService minioService,
            @Value("${minio.bucket.product}") String productBucket,
            @Value("${minio.bucket.category}") String categoryBucket,
            @Value("${minio.bucket.user}") String userBucket,
            @Value("${minio.bucket.banner:products-image}") String bannerBucket) {
        this.minioService = minioService;
        this.allowedBuckets = new HashSet<>(List.of(productBucket, categoryBucket, userBucket, bannerBucket));
    }

    @GetMapping("/{bucket}/{objectName}")
    public ResponseEntity<StreamingResponseBody> proxyFile(
            @PathVariable String bucket,
            @PathVariable String objectName) {
        if (!allowedBuckets.contains(bucket)) {
            return ResponseEntity.notFound().build();
        }
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
