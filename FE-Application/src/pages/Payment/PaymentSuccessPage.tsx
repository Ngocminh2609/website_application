import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Result,
  Button,
  Steps,
  Card,
  Spin,
  Typography,
  Space,
  Divider,
} from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ShoppingOutlined,
  HomeOutlined,
  LoadingOutlined,
  TruckOutlined,
  SolutionOutlined,
  SmileOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { usePaymentSuccess } from "../../hooks/Payment/usePaymentSuccess";
import { formatCurrency } from "./helper";
import { styles } from "./styles/payment-success.styles";
import { PAYMENT_STRINGS } from "../../constants/Payment/payment";

const { Title, Text } = Typography;

/**
 * Trang thông báo kết quả thanh toán chuyên nghiệp.
 * Sử dụng Ant Design để tạo giao diện hiện đại, thân thiện.
 */
const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { status, txnRef, amount } = usePaymentSuccess();

  if (status === "loading") {
    return (
      <div style={styles.loadingContainer}>
        <Spin
          indicator={<LoadingOutlined style={styles.loadingIcon} spin />}
          tip={PAYMENT_STRINGS.verifyLoading}
        />
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <Card
        className="glass-effect"
        bordered={false}
        style={styles.card}
      >
        {status === "success" ? (
          <Result
            status="success"
            icon={<CheckCircleFilled style={styles.successIcon} />}
            title={
              <Title level={2} style={styles.titleText}>
                {PAYMENT_STRINGS.success.title}
              </Title>
            }
            subTitle={
              <Space direction="vertical" style={styles.detailCardInnerSpace}>
                <Text style={styles.subTitleText}>
                  {PAYMENT_STRINGS.success.description}
                </Text>
                <Card
                  size="small"
                  style={styles.detailCard}
                >
                  <Space split={<Divider type="vertical" />} wrap>
                    <Text style={styles.textMain}>
                      {PAYMENT_STRINGS.success.orderIdLabel}
                      <b style={styles.textPrimaryHighlight}>#{txnRef}</b>
                    </Text>
                    <Text style={styles.textMain}>
                      {PAYMENT_STRINGS.success.amountLabel}
                      <b style={styles.textRedHighlight}>
                        {formatCurrency(amount)}
                      </b>
                    </Text>
                  </Space>
                </Card>
              </Space>
            }
          />
        ) : (
          <Result
            status="error"
            icon={<CloseCircleFilled style={styles.failedIcon} />}
            title={
              <Title level={2} style={styles.titleText}>
                {PAYMENT_STRINGS.failed.title}
              </Title>
            }
            subTitle={
              <Text style={styles.subTitleText}>
                {PAYMENT_STRINGS.failed.description}
              </Text>
            }
          />
        )}

        {status === "success" && (
          <div style={styles.stepsSection}>
            <Divider style={styles.stepsDivider}>
              {PAYMENT_STRINGS.steps.divider}
            </Divider>
            <Steps
              current={1}
              items={[
                {
                  title: (
                    <span style={styles.stepSpanText}>
                      {PAYMENT_STRINGS.steps.paid}
                    </span>
                  ),
                  icon: <CheckCircleFilled />,
                },
                {
                  title: (
                    <span style={styles.stepSpanText}>
                      {PAYMENT_STRINGS.steps.processing}
                    </span>
                  ),
                  icon: <SolutionOutlined />,
                },
                {
                  title: (
                    <span style={styles.stepSpanText}>
                      {PAYMENT_STRINGS.steps.shipping}
                    </span>
                  ),
                  icon: <TruckOutlined />,
                },
                {
                  title: (
                    <span style={styles.stepSpanText}>
                      {PAYMENT_STRINGS.steps.completed}
                    </span>
                  ),
                  icon: <SmileOutlined />,
                },
              ]}
            />
            <div style={styles.noteContainer}>
              <Text italic style={styles.noteText}>
                {PAYMENT_STRINGS.steps.note}
              </Text>
            </div>
          </div>
        )}

        <div style={styles.actionButtonsContainer}>
          <Space size="middle">
            <Button
              type="primary"
              size="large"
              icon={<HistoryOutlined />}
              onClick={() => navigate("/orders")}
              style={styles.btnPrimary}
            >
              {PAYMENT_STRINGS.buttons.viewOrders}
            </Button>
            <Button
              size="large"
              icon={<ShoppingOutlined />}
              onClick={() => navigate("/products")}
              style={styles.btnSecondary}
            >
              {PAYMENT_STRINGS.buttons.continueShopping}
            </Button>
            <Button
              size="large"
              icon={<HomeOutlined />}
              onClick={() => navigate("/")}
              style={styles.btnSecondary}
            >
              {PAYMENT_STRINGS.buttons.goHome}
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
