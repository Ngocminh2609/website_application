package com.ecommerce.backend.service;

import io.minio.BucketExistsArgs;
import io.minio.GetObjectArgs;
import io.minio.GetObjectResponse;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Service
public class MinioService {

    private final MinioClient minioClient;

    // URL public cua BE de tao proxy URL tra ve cho FE, thay vi dung presigned URL het han
    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @Autowired
    public MinioService(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    /**
     * Tải tệp lên bucket và trả về presigned URL.
     * Presigned URL cho phép truy cập file trong bucket Private mà không cần public bucket,
     * vì URL đã chứa chữ ký xác thực hợp lệ trong thời hạn nhất định.
     */
    public String uploadFile(MultipartFile file, String bucketName) {
        try {
            // Tạo bucket nếu chưa tồn tại - Backblaze B2 không hỗ trợ setBucketPolicy qua SDK
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            }

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            try (InputStream inputStream = file.getInputStream()) {
                minioClient.putObject(
                        PutObjectArgs.builder()
                                .bucket(bucketName)
                                .object(fileName)
                                .stream(inputStream, file.getSize(), -1)
                                .contentType(file.getContentType())
                                .build()
                );
            }

            // Tra ve proxy URL qua BE thay vi presigned URL, nhu vay anh khong bi het han sau 7 ngay
            return baseUrl + "/api/files/" + bucketName + "/" + fileName;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tải tệp lên MinIO: " + e.getMessage(), e);
        }
    }

    /**
     * Lay file tu storage duoi dang stream de controller co the tra thang ve cho browser.
     * Dung GetObjectResponse thay vi InputStream thong thuong de giu lai Content-Type header.
     */
    public GetObjectResponse getObject(String bucketName, String objectName) {
        try {
            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy tệp từ storage: " + e.getMessage(), e);
        }
    }

    /**
     * Xóa tệp khỏi bucket dựa trên URL.
     * Tách tên tệp từ URL (bỏ qua phần query string của presigned URL) trước khi xóa.
     */
    public void deleteFile(String fileUrl, String bucketName) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return;
        }
        try {
            // Loai bo query string cua presigned URL truoc khi lay ten file
            String urlWithoutQuery = fileUrl.contains("?") ? fileUrl.substring(0, fileUrl.indexOf("?")) : fileUrl;
            String fileName = urlWithoutQuery.substring(urlWithoutQuery.lastIndexOf("/") + 1);
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .build()
            );
        } catch (Exception e) {
            System.err.println("Lỗi khi xóa tệp từ MinIO: " + e.getMessage());
        }
    }
}
