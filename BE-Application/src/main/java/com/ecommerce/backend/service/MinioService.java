package com.ecommerce.backend.service;

import io.minio.BucketExistsArgs;
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

    @Value("${minio.url.external}")
    private String externalUrl;

    @Autowired
    public MinioService(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    /**
     * Tải tệp tin lên một bucket cụ thể trong MinIO.
     * Hàm này kiểm tra sự tồn tại của bucket trước khi tải lên, nếu không có sẽ tự động tạo.
     * Tên tệp tin được generate ngẫu nhiên bằng UUID để tránh trùng lặp.
     */
    public String uploadFile(MultipartFile file, String bucketName) {
        try {
            // Kiểm tra và tạo bucket nếu chưa có
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
                
                // Thiết lập chính sách (Policy) cho phép đọc công khai (Public Read)
                // Điều này cho phép Frontend có thể hiển thị ảnh qua URL trực tiếp
                String policy = "{\n" +
                        "    \"Version\": \"2012-10-17\",\n" +
                        "    \"Statement\": [\n" +
                        "        {\n" +
                        "            \"Effect\": \"Allow\",\n" +
                        "            \"Principal\": {\"AWS\": [\"*\"]},\n" +
                        "            \"Action\": [\"s3:GetBucketLocation\", \"s3:ListBucket\"],\n" +
                        "            \"Resource\": [\"arn:aws:s3:::" + bucketName + "\"]\n" +
                        "        },\n" +
                        "        {\n" +
                        "            \"Effect\": \"Allow\",\n" +
                        "            \"Principal\": {\"AWS\": [\"*\"]},\n" +
                        "            \"Action\": [\"s3:GetObject\"],\n" +
                        "            \"Resource\": [\"arn:aws:s3:::" + bucketName + "/*\"]\n" +
                        "        }\n" +
                        "    ]\n" +
                        "}";
                minioClient.setBucketPolicy(
                        io.minio.SetBucketPolicyArgs.builder()
                                .bucket(bucketName)
                                .config(policy)
                                .build()
                );
            }

            // Tạo tên tệp tin duy nhất
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            
            // Thực hiện tải lên
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

            // Trả về URL của tệp tin vừa tải lên
            return externalUrl + "/" + bucketName + "/" + fileName;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tải tệp lên MinIO: " + e.getMessage(), e);
        }
    }

    /**
     * Xóa tệp tin khỏi MinIO dựa trên URL.
     * Hàm này tách lấy tên tệp từ URL và thực hiện xóa trong bucket tương ứng.
     */
    public void deleteFile(String fileUrl, String bucketName) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return;
        }
        try {
            String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .build()
            );
        } catch (Exception e) {
            // Log lỗi nhưng không chặn luồng chính nếu xóa file thất bại
            System.err.println("Lỗi khi xóa tệp từ MinIO: " + e.getMessage());
        }
    }
}
