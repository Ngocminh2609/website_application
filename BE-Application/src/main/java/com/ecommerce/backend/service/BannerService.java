package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Banner;
import com.ecommerce.backend.repository.BannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BannerService {

    private final BannerRepository bannerRepository;
    private final MinioService minioService;

    @Value("${minio.bucket.banner:products-image}")
    private String bannerBucket;

    @Autowired
    public BannerService(BannerRepository bannerRepository, MinioService minioService) {
        this.bannerRepository = bannerRepository;
        this.minioService = minioService;
    }

    public List<Banner> getActiveBanners() {
        return bannerRepository.findByIsActiveTrueOrderBySortOrderAsc();
    }

    public List<Banner> getAllBanners() {
        return bannerRepository.findAllByOrderBySortOrderAsc();
    }

    public Optional<Banner> getBannerById(Long id) {
        return bannerRepository.findById(id);
    }

    public Banner createBanner(Banner banner) {
        return bannerRepository.save(banner);
    }

    public Banner updateBanner(Long id, Banner bannerDetails) {
        return bannerRepository.findById(id).map(banner -> {
            // Xóa ảnh cũ nếu cập nhật ảnh mới
            if (bannerDetails.getImageUrl() != null && !bannerDetails.getImageUrl().equals(banner.getImageUrl())) {
                minioService.deleteFile(banner.getImageUrl(), bannerBucket);
            }
            banner.setTitle(bannerDetails.getTitle());
            banner.setImageUrl(bannerDetails.getImageUrl());
            banner.setLinkUrl(bannerDetails.getLinkUrl());
            banner.setSortOrder(bannerDetails.getSortOrder());
            banner.setIsActive(bannerDetails.getIsActive());
            return bannerRepository.save(banner);
        }).orElseThrow(() -> new RuntimeException("Banner không tìm thấy với id " + id));
    }

    public void deleteBanner(Long id) {
        bannerRepository.findById(id).ifPresent(banner -> {
            minioService.deleteFile(banner.getImageUrl(), bannerBucket);
            bannerRepository.deleteById(id);
        });
    }
}
