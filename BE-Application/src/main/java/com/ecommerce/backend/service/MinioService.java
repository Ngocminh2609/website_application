package com.ecommerce.backend.service;

import io.minio.BucketExistsArgs;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.http.Method;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class MinioService {

    private final MinioClient minioClient;

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

            // Tạo presigned URL có hiệu lực 7 ngày thay vì direct URL để dùng được với private bucket
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucketName)
                            .object(fileName)
                            .expiry(7, TimeUnit.DAYS)
                            .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tải tệp lên MinIO: " + e.getMessage(), e);
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

    /**
     * Tao presigned URL tu bucket va ten object bat ky.
     * Dung cho endpoint phuc vu anh cu da co san trong bucket ma khong qua uploadFile.
     */
    public String getPresignedUrl(String bucket, String objectName) {
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucket)
                            .object(objectName)
                            .expiry(7, TimeUnit.DAYS)
                            .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Loi khi tao presigned URL: " + e.getMessage(), e);
        }
    }
}
