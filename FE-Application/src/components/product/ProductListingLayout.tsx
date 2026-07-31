import React from "react";
import {Col, Layout, Row} from "antd";
import type {CSSProperties, ReactNode} from "react";
import type {Product} from "../../types/product";
import ProductCard from "../common/ProductCard";
import {PageLoading} from "../common/PageLoading";

interface Props {
    loading: boolean;
    loadingTip?: ReactNode;
    loadingStyle?: CSSProperties;
    layoutStyle?: CSSProperties;
    breadcrumb?: ReactNode;
    sidebar: ReactNode;
    header: ReactNode;
    products: Product[];
    emptyContent: ReactNode;
    productColProps: { xs?: number; sm?: number; md?: number; xl?: number; xxl?: number };
    rowGutter?: [number, number];
}

const ProductListingLayout: React.FC<Props> = ({
    loading,
    loadingTip,
    loadingStyle,
    layoutStyle,
    breadcrumb,
    sidebar,
    header,
    products,
    emptyContent,
    productColProps,
    rowGutter = [24, 24],
}) => {
    if (loading) {
        return <PageLoading tip={loadingTip} style={loadingStyle}/>;
    }

    return (
        <Layout style={layoutStyle}>
            <div className="main-content">
                {breadcrumb}
                <Row gutter={[40, 40]}>
                    <Col xs={24} lg={6}>{sidebar}</Col>
                    <Col xs={24} lg={18}>
                        {header}
                        {products.length > 0 ? (
                            <Row gutter={rowGutter}>
                                {products.map((product) => (
                                    <Col {...productColProps} key={product.id}>
                                        <ProductCard product={product}/>
                                    </Col>
                                ))}
                            </Row>
                        ) : emptyContent}
                    </Col>
                </Row>
            </div>
        </Layout>
    );
};

export default ProductListingLayout;
