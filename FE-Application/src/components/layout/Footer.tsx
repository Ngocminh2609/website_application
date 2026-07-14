import React from "react";
import { Layout } from "antd";
import { styles } from "./styles/Footer.styles";
import { LAYOUT_STRINGS } from "../../constants/Layout/layout";

const { Footer: AntFooter } = Layout;

/**
 * Footer Component sử dụng Layout.Footer của Ant Design.
 */
const Footer: React.FC = () => {
  return (
    <AntFooter style={styles.footer}>
      {LAYOUT_STRINGS.footer.copyright}
    </AntFooter>
  );
};

export default Footer;
