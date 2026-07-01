package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Banner;
import com.ecommerce.backend.service.BannerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
public class BannerController {

    private final BannerService bannerService;

    @Autowired
    public BannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    /**
     * Lấy danh sách banner đang hoạt động cho người dùng (HomePage).
     */
    @GetMapping
    public List<Banner> getActiveBanners() {
        return bannerService.getActiveBanners();
    }

    /**
     * Lấy tất cả banner cho trang quản trị. (Yêu cầu quyền ADMIN)
     */
    @GetMapping("/admin")
    public List<Banner> getAllBanners() {
        return bannerService.getAllBanners();
    }

    /**
     * Lấy banner chi tiết theo ID. (Yêu cầu quyền ADMIN)
     */
    @GetMapping("/admin/{id}")
    public ResponseEntity<Banner> getBannerById(@PathVariable Long id) {
        return bannerService.getBannerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Tạo banner mới. (Yêu cầu quyền ADMIN)
     */
    @PostMapping("/admin")
    public Banner createBanner(@Valid @RequestBody Banner banner) {
        return bannerService.createBanner(banner);
    }

    /**
     * Cập nhật banner. (Yêu cầu quyền ADMIN)
     */
    @PutMapping("/admin/{id}")
    public ResponseEntity<Banner> updateBanner(@PathVariable Long id, @Valid @RequestBody Banner bannerDetails) {
        try {
            return ResponseEntity.ok(bannerService.updateBanner(id, bannerDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Xóa banner. (Yêu cầu quyền ADMIN)
     */
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteBanner(@PathVariable Long id) {
        bannerService.deleteBanner(id);
        return ResponseEntity.noContent().build();
    }
}
