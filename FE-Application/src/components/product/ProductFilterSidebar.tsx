import type { FC } from "react";
import { Card, Checkbox, Slider, Space, Typography } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import type { Category } from "../../types/category";
import { formatVnd } from "../../utils/format";
import { filterSidebarStyles as styles } from "./styles/ProductFilterSidebar.styles";

const { Title, Text } = Typography;

export interface ProductFilterLabels {
  filterTitle: string;
  brandLabel: string;
  categoryLabel: string;
  priceRangeLabel: string;
}

interface ProductFilterSidebarProps {
  brands: string[];
  categories: Category[];
  selectedBrands: string[];
  onBrandsChange: (brands: string[]) => void;
  selectedCategories: number[];
  onCategoriesChange: (categories: number[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  labels: ProductFilterLabels;
  /** Ẩn section brand khi không có brand (SearchPage) */
  hideEmptyBrands?: boolean;
  priceStep?: number;
  className?: string;
  bordered?: boolean;
}

/**
 * Sidebar bộ lọc sản phẩm dùng chung cho ProductsPage và SearchPage.
 */
export const ProductFilterSidebar: FC<ProductFilterSidebarProps> = ({
  brands,
  categories,
  selectedBrands,
  onBrandsChange,
  selectedCategories,
  onCategoriesChange,
  priceRange,
  onPriceRangeChange,
  labels,
  hideEmptyBrands = false,
  priceStep = 500000,
  className,
  bordered = true,
}) => {
  const showBrands = !hideEmptyBrands || brands.length > 0;

  return (
    <div style={styles.sidebarWrapper}>
      <Card
        title={
          <Title level={4} style={styles.filterTitle}>
            <FilterOutlined /> {labels.filterTitle}
          </Title>
        }
        style={styles.sidebarCard}
        className={className}
        bordered={bordered}
        styles={{
          body: styles.sidebarCardBody,
          header: styles.sidebarCardHeader,
        }}
      >
        <Space direction="vertical" size="large" style={styles.fullWidthSpace}>
          {showBrands && (
            <div>
              <Text strong style={styles.filterSectionTitle}>
                {labels.brandLabel}
              </Text>
              <Checkbox.Group
                options={brands}
                value={selectedBrands}
                onChange={(vals) => onBrandsChange(vals as string[])}
                style={styles.checkboxGroup}
                className="premium-checkbox"
              />
            </div>
          )}

          <div>
            <Text strong style={styles.filterSectionTitle}>
              {labels.categoryLabel}
            </Text>
            <Checkbox.Group
              value={selectedCategories}
              onChange={(vals) => onCategoriesChange(vals as number[])}
              style={styles.checkboxGroup}
              className="premium-checkbox"
            >
              {categories.map((cat) => (
                <Checkbox key={cat.id} value={cat.id} style={styles.checkboxLabel}>
                  {cat.name}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </div>

          <div>
            <Text strong style={styles.filterSectionTitle}>
              {labels.priceRangeLabel}
            </Text>
            <Slider
              range
              min={0}
              max={100000000}
              step={priceStep}
              value={priceRange}
              onChange={(val) => onPriceRangeChange(val as [number, number])}
              tooltip={{
                formatter: (val) => formatVnd(val ?? 0),
              }}
              trackStyle={[styles.sliderTrack]}
              handleStyle={[styles.sliderHandle, styles.sliderHandle]}
            />
            <div style={styles.sliderPriceRow}>
              <Text style={styles.sliderPriceText}>
                {formatVnd(priceRange[0])}
              </Text>
              <Text style={styles.sliderPriceText}>
                {formatVnd(priceRange[1])}
              </Text>
            </div>
          </div>
        </Space>
      </Card>
    </div>
  );
};
