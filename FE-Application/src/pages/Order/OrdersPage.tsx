import React from "react";
import {
    Layout,
    Typography,
    Table,
    Card,
    Button,
} from "antd";
import {ShoppingOutlined} from "@ant-design/icons";
import {useOrdersPage} from "../../hooks/Order/useOrdersPage";
import {getOrderTableColumns} from "./helper";
import {styles} from "./styles/orders-page.styles";
import {ORDER_STRINGS} from "../../constants/Order/orders";
import {PageLoading} from "../../components/common/PageLoading";
import {TABLE_PAGE_SIZE} from "../../constants/Common/pagination";
import EmptyStateCard from "../../components/common/EmptyStateCard";

const {Content} = Layout;
const {Title, Text} = Typography;

/**
 * Trang Lịch sử đơn hàng chuyên nghiệp.
 */
const OrdersPage: React.FC = () => {
    const {orders, loading} = useOrdersPage();
    const columns = getOrderTableColumns();

    return (
        <Content className="main-content" style={styles.content}>
            <div style={styles.headerContainer}>
                <Title level={2} style={styles.title}>
                    {ORDER_STRINGS.title}
                </Title>
                <Text style={styles.subtitle}>
                    {ORDER_STRINGS.subtitle}
                </Text>
            </div>

            {loading ? (
                <PageLoading style={styles.loadingContainer}/>
            ) : orders.length === 0 ? (
                <EmptyStateCard
                    wrapper="card"
                    style={styles.emptyCard}
                    icon={<ShoppingOutlined/>}
                    iconStyle={styles.emptyIcon}
                    title={<Text style={styles.emptyText}>{ORDER_STRINGS.emptyDescription}</Text>}
                    action={
                        <Button type="primary" onClick={() => (window.location.href = "/products")}>
                            {ORDER_STRINGS.shopNow}
                        </Button>
                    }
                />
            ) : (
                <Card className="glass-effect" styles={{body: {padding: 0}}}>
                    <Table
                        columns={columns}
                        dataSource={orders}
                        rowKey="id"
                        pagination={{pageSize: TABLE_PAGE_SIZE.orders}}
                        scroll={{x: 800}}
                    />
                </Card>
            )}
        </Content>
    );
};

export default OrdersPage;
