package com.ecommerce.files.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.util.UUID;

@Service
public class MinioService {

    private final S3Client s3Client;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @Autowired
    public MinioService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadFile(MultipartFile file, String bucketName) {
        try {
            ensureBucketExists(bucketName);

            String fileName = UUID.randomUUID() + "_" + sanitizeFileName(file.getOriginalFilename());

            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(fileName)
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize())
            );

            return baseUrl + "/api/files/" + bucketName + "/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi tải tệp lên storage: " + e.getMessage(), e);
        }
    }

    public ResponseInputStream<GetObjectResponse> getObject(String bucketName, String objectName) {
        return s3Client.getObject(
                GetObjectRequest.builder()
                        .bucket(bucketName)
                        .key(objectName)
                        .build()
        );
    }

//    public void deleteFile(String fileUrl, String bucketName) {
//        if (fileUrl == null || fileUrl.isEmpty()) {
//            return;
//        }
//        try {
//            String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
//            s3Client.deleteObject(
//                    DeleteObjectRequest.builder()
//                            .bucket(bucketName)
//                            .key(fileName)
//                            .build()
//            );
//        } catch (Exception e) {
//            log.warn("Lỗi khi xóa tệp từ storage: {}", e.getMessage());
//        }
//    }

    private String sanitizeFileName(String originalFileName) {
        if (originalFileName == null || originalFileName.isBlank()) {
            return "file";
        }
        String baseName = originalFileName.replace("\\", "/");
        baseName = baseName.substring(baseName.lastIndexOf('/') + 1);
        return baseName.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private void ensureBucketExists(String bucketName) {
        try {
            s3Client.headBucket(HeadBucketRequest.builder().bucket(bucketName).build());
        } catch (NoSuchBucketException e) {
            s3Client.createBucket(CreateBucketRequest.builder().bucket(bucketName).build());
        }
    }
}
