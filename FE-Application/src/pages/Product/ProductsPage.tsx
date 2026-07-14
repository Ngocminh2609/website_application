import React, { useState, useEffect, useMemo } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Checkbox,
  Slider,
  Space,
  Card,
  Tag,
  Empty,
  Spin,
} from "antd";
import { FilterOutlined, RocketOutlined } from "@ant-design/icons";
import { useSearchParams, useLocation } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import ProductCard from "../../components/common/ProductCard";

const { Title, Text } = Typography;

/**
 * Trang danh sách sản phẩm đầy đủ với bộ lọc hiện đại.
 * Hỗ trợ lọc theo Hãng (Brand), Danh mục (Category) và Giá (Price).
 */
const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { products, categories, fetchProducts, initializeHomeData } =
    useProducts();

  const [loading, setLoading] = useState<boolean>(true);

  // Trạng thái bộ lọc - Khởi tạo từ URL nếu có
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.getAll("brand"),
  );
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    searchParams.getAll("category").map((id) => parseInt(id)),
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 100000000,
  ]);

  useEffect(() => {
    // Cập nhật URL khi bộ lọc thay đổi
    const params = new URLSearchParams();
    selectedBrands.forEach((brand) => params.append("brand", brand));
    selectedCategories.forEach((catId) =>
      params.append("category", catId.toString()),
    );

    // Chỉ cập nhật nếu searchParams hiện tại khác với params mới để tránh loop
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [searchParams, selectedBrands, selectedCategories, setSearchParams]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        // Sử dụng Context để fetch dữ liệu, đảm bảo không gọi trùng lặp (Single Flight)
        await Promise.all([
          fetchProducts(),
          initializeHomeData(), // Lấy categories
        ]);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [fetchProducts, initializeHomeData, location.key]);

  const brands = useMemo(() => {
    const uniqueBrands = new Set(
      products.map((p) => p.brand).filter(Boolean) as string[],
    );
    return Array.from(uniqueBrands);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchBrand =
        selectedBrands.length === 0 ||
        (p.brand && selectedBrands.includes(p.brand));
      const matchCategory =
        selectedCategories.length === 0 ||
        (p.category && selectedCategories.includes(p.category.id));
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchBrand && matchCategory && matchPrice;
    });
  }, [products, selectedBrands, selectedCategories, priceRange]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout
      style={{
        background: "transparent",
        minHeight: "100vh",
        paddingTop: "100px",
      }}
    >
      <div className="main-content">
        <Row gutter={[40, 40]}>
          {/* SIDEBAR FILTER */}
          <Col xs={24} lg={6}>
            <div style={{ position: "sticky", top: "100px" }}>
              <Card
                title={
                  <Title
                    level={4}
                    style={{ margin: 0, color: "var(--text-main)" }}
                  >
                    <FilterOutlined /> BỘ LỌC TÌM KIẾM
                  </Title>
                }
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "20px",
                  backdropFilter: "blur(10px)",
                }}
                styles={{
                  body: { padding: "24px" },
                  header: { borderBottom: "1px solid rgba(255,255,255,0.05)" },
                }}
              >
                <Space
                  direction="vertical"
                  size="large"
                  style={{ width: "100%" }}
                >
                  <div>
                    <Text
                      strong
                      style={{
                        color: "var(--text-main)",
                        display: "block",
                        marginBottom: "15px",
                      }}
                    >
                      THƯƠNG HIỆU
                    </Text>
                    <Checkbox.Group
                      options={brands}
                      value={selectedBrands}
                      onChange={(vals) => setSelectedBrands(vals as string[])}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    />
                  </div>

                  <div>
                    <Text
                      strong
                      style={{
                        color: "var(--text-main)",
                        display: "block",
                        marginBottom: "15px",
                      }}
                    >
                      CHUYÊN MỤC
                    </Text>
                    <Checkbox.Group
                      value={selectedCategories}
                      onChange={(vals) =>
                        setSelectedCategories(vals as number[])
                      }
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {categories.map((cat) => (
                        <Checkbox
                          key={cat.id}
                          value={cat.id}
                          style={{ color: "var(--text-muted)" }}
                        >
                          {cat.name}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  </div>

                  <div>
                    <Text
                      strong
                      style={{
                        color: "var(--text-main)",
                        display: "block",
                        marginBottom: "15px",
                      }}
                    >
                      KHOẢNG GIÁ (VND)
                    </Text>
                    <Slider
                      range
                      min={0}
                      max={100000000}
                      step={500000}
                      value={priceRange}
                      onChange={(val) => setPriceRange(val as [number, number])}
                      tooltip={{
                        formatter: (val) => `${val?.toLocaleString("vi-VN")} ₫`,
                      }}
                      trackStyle={[{ backgroundColor: "var(--primary-color)" }]}
                      handleStyle={[
                        {
                          borderColor: "var(--primary-color)",
                          backgroundColor: "var(--primary-color)",
                        },
                        {
                          borderColor: "var(--primary-color)",
                          backgroundColor: "var(--primary-color)",
                        },
                      ]}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "8px",
                      }}
                    >
                      <Text
                        style={{
                          color: "var(--primary-color)",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                        }}
                      >
                        {priceRange[0].toLocaleString("vi-VN")} ₫
                      </Text>
                      <Text
                        style={{
                          color: "var(--primary-color)",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                        }}
                      >
                        {priceRange[1].toLocaleString("vi-VN")} ₫
                      </Text>
                    </div>
                  </div>
                </Space>
              </Card>
            </div>
          </Col>

          {/* PRODUCT LIST CONTENT */}
          <Col xs={24} lg={18}>
            <div
              style={{
                marginBottom: "30px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Title
                  level={2}
                  style={{ color: "var(--text-main)", margin: 0 }}
                >
                  Kho Siêu Phẩm
                </Title>
                <Text style={{ color: "var(--text-muted)" }}>
                  Tìm thấy {filteredProducts.length} sản phẩm phù hợp
                </Text>
              </div>
              <Space>
                <Tag color="blue" icon={<RocketOutlined />}>
                  Giao nhanh 2h
                </Tag>
                <Tag color="purple">Chính hãng 100%</Tag>
              </Space>
            </div>

            {filteredProducts.length > 0 ? (
              <Row gutter={[24, 24]}>
                {filteredProducts.map((product) => (
                  <Col xs={24} sm={12} md={8} xl={8} xxl={6} key={product.id}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div
                style={{
                  padding: "100px",
                  textAlign: "center",
                  background: "var(--glass-bg)",
                  borderRadius: "20px",
                }}
              >
                <Empty
                  description={
                    <span style={{ color: "var(--text-main)" }}>
                      Không tìm thấy sản phẩm nào khớp với bộ lọc của bạn
                    </span>
                  }
                />
              </div>
            )}
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default ProductsPage;
