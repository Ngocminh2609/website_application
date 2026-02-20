package com.ecommerce.backend.service;

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

    // URL public cua BE de tao proxy URL tra ve cho FE, thay vi dung presigned URL het han
    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @Autowired
    public MinioService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    /**
     * Tai tep len bucket va tra ve proxy URL qua BE.
     * Proxy URL khong bao gio het han, khac voi presigned URL chi co hieu luc 7 ngay.
     */
    public String uploadFile(MultipartFile file, String bucketName) {
        try {
            // Tao bucket neu chua ton tai - chi can thiet voi MinIO local
            ensureBucketExists(bucketName);

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

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

    /**
     * Lay file tu storage duoi dang stream de controller co the tra thang ve cho browser.
     */
    public ResponseInputStream<GetObjectResponse> getObject(String bucketName, String objectName) {
        return s3Client.getObject(
                GetObjectRequest.builder()
                        .bucket(bucketName)
                        .key(objectName)
                        .build()
        );
    }

    /**
     * Xoa tep khoi bucket dua tren URL proxy.
     * Tach ten tep tu URL (bo qua phan /api/files/bucket/ o dau) truoc khi xoa.
     */
    public void deleteFile(String fileUrl, String bucketName) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return;
        }
        try {
            String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            s3Client.deleteObject(
                    DeleteObjectRequest.builder()
                            .bucket(bucketName)
                            .key(fileName)
                            .build()
            );
        } catch (Exception e) {
            System.err.println("Lỗi khi xóa tệp từ storage: " + e.getMessage());
        }
    }

    /**
     * Kiem tra va tao bucket neu chua ton tai.
     * Voi Backblaze B2 bucket da duoc tao thu cong nen thuong khong can goi ham nay,
     * giu lai de tuong thich voi MinIO local tu dong tao bucket.
     */
    private void ensureBucketExists(String bucketName) {
        try {
            s3Client.headBucket(HeadBucketRequest.builder().bucket(bucketName).build());
        } catch (NoSuchBucketException e) {
            s3Client.createBucket(CreateBucketRequest.builder().bucket(bucketName).build());
        }
    }
}
