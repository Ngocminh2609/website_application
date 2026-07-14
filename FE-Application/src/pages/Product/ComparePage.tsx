import React from "react";
import { useCompare } from "../../hooks/useCompare";
import {
  Typography,
  Row,
  Col,
  Card,
  Button,
  Empty,
  Tag,
  Layout,
  Tooltip,
} from "antd";
import {
  ShoppingCartOutlined,
  CloseOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { StarRating } from "../../components/common/ProductCard";
import { useCart } from "../../hooks/useCart";

const { Title, Text } = Typography;

const ComparePage: React.FC = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { refreshCart } = useCart();
  const navigate = useNavigate();
  const fallbackImage =
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800";

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    if (target.dataset.errored === "true") return;
    target.dataset.errored = "true";
    target.src = fallbackImage;
  };

  if (compareItems.length === 0) {
    return (
      <Layout
        style={{
          background: "transparent",
          minHeight: "100vh",
          paddingTop: "300px",
        }}
      >
        <div style={{ padding: "50px 20px", textAlign: "center" }}>
          <Empty
            description="Chưa có sản phẩm nào để so sánh"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => navigate("/products")}>
              Tiếp tục xem sản phẩm
            </Button>
          </Empty>
        </div>
      </Layout>
    );
  }

  // Hàm giải mã thông số kỹ thuật (hỗ trợ cả JSON và chuỗi định dạng Key: Value; Key2: Value)
  const parseSpecs = (
    specsStr: string | null | undefined,
  ): Record<string, string> => {
    if (!specsStr) return {};
    try {
      // Thử parse JSON trước
      return JSON.parse(specsStr);
    } catch {
      // Nếu không phải JSON, parse theo định dạng chuỗi: Label: Value; Label2: Value
      const specs: Record<string, string> = {};
      specsStr.split(";").forEach((part) => {
        const [key, ...valueParts] = part.split(":");
        if (key) {
          specs[key.trim()] = valueParts.join(":").trim();
        }
      });
      return specs;
    }
  };

  // Lấy tất cả các key từ specifications của tất cả sản phẩm
  const allSpecKeys = Array.from(
    new Set(
      compareItems.flatMap((item) =>
        Object.keys(parseSpecs(item.specifications)),
      ),
    ),
  );

  return (
    <Layout
      style={{
        background: "transparent",
        minHeight: "100vh",
        paddingTop: "20px",
      }}
    >
      <div className="main-content" style={{ padding: "40px 5%" }}>
        <div
          style={{
            marginBottom: "40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            type="text"
          >
            Trở về
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            So Sánh Sản Phẩm
          </Title>
          <Button danger onClick={clearCompare}>
            Xóa tất cả
          </Button>
        </div>

        <div style={{ paddingBottom: "20px" }}>
          <div style={{ minWidth: compareItems.length * 300 + 200 }}>
            <Row gutter={[24, 24]} wrap={false}>
              {/* Cột tiêu đề thông số */}
              <Col
                span={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  paddingTop: "428px",
                }}
              >
                <div
                  style={{
                    height: "50px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    color: "var(--text-muted)",
                  }}
                >
                  Giá tiền
                </div>
                <div
                  style={{
                    height: "50px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    color: "var(--text-muted)",
                  }}
                >
                  Thương hiệu
                </div>
                <div
                  style={{
                    height: "50px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    color: "var(--text-muted)",
                  }}
                >
                  Đánh giá
                </div>

                <div
                  style={{
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Text
                    strong
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--primary-color)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    Thông số kỹ thuật
                  </Text>
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      background: "var(--glass-border)",
                      marginLeft: "12px",
                    }}
                  />
                </div>

                {allSpecKeys.map((key) => (
                  <div
                    key={key}
                    style={{
                      minHeight: "60px",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                      padding: "10px",
                    }}
                  >
                    {key}
                  </div>
                ))}
              </Col>

              {/* Các cột sản phẩm */}
              {compareItems.map((item) => {
                const specs = parseSpecs(item.specifications);
                return (
                  <Col key={item.id} style={{ width: "310px" }}>
                    <Card
                      hoverable
                      className="product-card"
                      cover={
                        <div
                          style={{
                            position: "relative",
                            overflow: "hidden",
                            height: "260px",
                            background: "var(--bg-secondary)",
                          }}
                        >
                          {/* Nút Xóa (Thiết kế y hệt nút Yêu thích của ProductCard) */}
                          <div
                            style={{
                              position: "absolute",
                              top: "12px",
                              right: "12px",
                              zIndex: 3,
                            }}
                          >
                            <Button
                              shape="circle"
                              icon={
                                <CloseOutlined style={{ fontSize: "14px" }} />
                              }
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeFromCompare(item.id);
                              }}
                              style={{
                                background: "var(--glass-bg)",
                                border: "none",
                                backdropFilter: "blur(4px)",
                                color: "#ff4d4f",
                              }}
                            />
                          </div>

                          <img
                            alt={item.name}
                            src={item.imageUrl}
                            onError={handleImgError}
                            className="product-image"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.5s ease",
                            }}
                          />
                        </div>
                      }
                      style={{
                        borderRadius: "20px",
                        overflow: "hidden",
                        height: "auto",
                        display: "flex",
                        flexDirection: "column",
                        background: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                        backdropFilter: "blur(10px)",
                      }}
                      styles={{
                        body: {
                          padding: "20px",
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        },
                      }}
                    >
                      <div>
                        <Tooltip title={item.name}>
                          <Title
                            level={4}
                            style={{
                              marginBottom: "16px",
                              color: "inherit",
                              fontSize: "1.1rem",
                              height: "2.8em",
                              overflow: "hidden",
                              fontWeight: 600,
                            }}
                            ellipsis={{ rows: 2 }}
                          >
                            {item.name}
                          </Title>
                        </Tooltip>
                      </div>

                      <Button
                        type="primary"
                        block
                        icon={<ShoppingCartOutlined />}
                        style={{
                          height: "42px",
                          borderRadius: "10px",
                          fontWeight: 600,
                        }}
                        onClick={async (e) => {
                          const target = e.currentTarget
                            .closest(".ant-card")
                            ?.querySelector("img");
                          if (target) {
                            const { flyToCart } =
                              await import("../../utils/cartAnimation");
                            flyToCart(target as HTMLImageElement);
                          }
                          const { cartApi } = await import("../../api/cartApi");
                          await cartApi.addToCart(item.id, 1);
                          await refreshCart(true);
                          navigate("/cart");
                        }}
                      >
                        Thêm vào giỏ
                      </Button>
                    </Card>

                    {/* Dữ liệu so sánh */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                        marginTop: "20px",
                      }}
                    >
                      <div
                        style={{
                          height: "50px",
                          display: "flex",
                          alignItems: "center",
                          fontSize: "1.2rem",
                          fontWeight: 700,
                          color: "var(--primary-color)",
                        }}
                      >
                        {item.price.toLocaleString("vi-VN")} ₫
                      </div>
                      <div
                        style={{
                          height: "50px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Tag color="blue">{item.brand || "TECH"}</Tag>
                      </div>
                      <div
                        style={{
                          height: "50px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <StarRating value={item.rating || 5} size={14} />
                        <span style={{ marginLeft: "8px" }}>
                          ({item.reviewCount || 0})
                        </span>
                      </div>
                      <div
                        style={{
                          height: "50px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            height: "1px",
                            background: "var(--glass-border)",
                          }}
                        />
                      </div>

                      {allSpecKeys.map((key) => (
                        <div
                          key={key}
                          style={{
                            minHeight: "60px",
                            display: "flex",
                            alignItems: "center",
                            padding: "10px",
                            background: "var(--bg-secondary)",
                            borderRadius: "8px",
                          }}
                        >
                          {specs[key] || <Text type="secondary">---</Text>}
                        </div>
                      ))}
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ComparePage;
