package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Banner;
import com.ecommerce.backend.repository.BannerRepository;
import com.ecommerce.backend.util.persistence.EntityLookupUtil;
import com.ecommerce.backend.util.storage.ImageReplaceUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.ecommerce.backend.constant.domain.ErrorMessageConstants.ERROR_BANNER_NOT_FOUND;

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

    public Banner requireBanner(Long id) {
        return EntityLookupUtil.require(bannerRepository.findById(id), ERROR_BANNER_NOT_FOUND);
    }

    public Banner createBanner(Banner banner) {
        return bannerRepository.save(banner);
    }

    public Banner updateBanner(Long id, Banner bannerDetails) {
        Banner banner = requireBanner(id);
        ImageReplaceUtil.deleteIfReplaced(
                banner.getImageUrl(), bannerDetails.getImageUrl(), bannerBucket, minioService::deleteFile
        );
        banner.setTitle(bannerDetails.getTitle());
        banner.setImageUrl(bannerDetails.getImageUrl());
        banner.setLinkUrl(bannerDetails.getLinkUrl());
        banner.setSortOrder(bannerDetails.getSortOrder());
        banner.setIsActive(bannerDetails.getIsActive());
        return bannerRepository.save(banner);
    }

    public void deleteBanner(Long id) {
        bannerRepository.findById(id).ifPresent(banner -> {
            minioService.deleteFile(banner.getImageUrl(), bannerBucket);
            bannerRepository.deleteById(id);
        });
    }
}
