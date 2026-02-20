package com.ecommerce.backend.controller;

import com.ecommerce.backend.service.MinioService;
import io.minio.GetObjectResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private final MinioService minioService;

    @Value("${minio.bucket.product}")
    private String productBucket;

    @Value("${minio.bucket.category}")
    private String categoryBucket;

    @Value("${minio.bucket.user}")
    private String userBucket;

    @Autowired
    public FileUploadController(MinioService minioService) {
        this.minioService = minioService;
    }

    /**
     * Endpoint chung để tải lên hình ảnh.
     * @param file Tệp tin hình ảnh từ client.
     * @param type Loại hình ảnh (product, category, user) để xác định bucket tương ứng.
     * @return URL của hình ảnh trên MinIO server.
     */
    @PostMapping("/{type}")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file, @PathVariable String type) {
        String bucketName;
        switch (type.toLowerCase()) {
            case "product":
                bucketName = productBucket;
                break;
            case "category":
                bucketName = categoryBucket;
                break;
            case "user":
                bucketName = userBucket;
                break;
            default:
                return ResponseEntity.badRequest().body(Map.of("message", "Loại hình ảnh không hợp lệ (hỗ trợ: product, category, user)"));
        }

        try {
            String url = minioService.uploadFile(file, bucketName);
            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Không thể tải lên hình ảnh: " + e.getMessage()));
        }
    }

    /**
     * Proxy anh tu MinIO/B2 ve browser de giai quyet van de bucket Private.
     * Browser goi endpoint nay, BE tu xac thuc voi B2 va tra file ve, FE khong can biet storage credentials.
     */
    @GetMapping("/api/files/{bucket}/{objectName}")
    public ResponseEntity<StreamingResponseBody> proxyFile(
            @PathVariable String bucket,
            @PathVariable String objectName) {
        try {
            GetObjectResponse objectResponse = minioService.getObject(bucket, objectName);
            // Lay Content-Type tu response cua MinIO/B2, fallback ve octet-stream neu khong co
            String contentType = objectResponse.headers().get("Content-Type");
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
