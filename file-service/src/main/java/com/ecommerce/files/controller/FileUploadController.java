package com.ecommerce.files.controller;

import com.ecommerce.files.service.MinioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@SuppressWarnings("SpellCheckingInspection")
public class FileUploadController {

    private final MinioService minioService;

    @Value("${minio.bucket.product}")
    private String productBucket;

    @Value("${minio.bucket.category}")
    private String categoryBucket;

    @Value("${minio.bucket.user}")
    private String userBucket;

    @Value("${minio.bucket.banner:products-image}")
    private String bannerBucket;

    @Autowired
    public FileUploadController(MinioService minioService) {
        this.minioService = minioService;
    }

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
            case "banner":
                bucketName = bannerBucket;
                break;
            default:
                return ResponseEntity.badRequest().body(Map.of("message", "Loại hình ảnh không hợp lệ (hỗ trợ: product, category, user, banner)"));
        }

        try {
            String url = minioService.uploadFile(file, bucketName);
            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Không thể tải lên hình ảnh: " + e.getMessage()));
        }
    }
}
