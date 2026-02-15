import React from 'react';
import { Button } from 'antd';
import type { ButtonProps } from 'antd';

/**
 * Thành phần Button dùng chung được tùy chỉnh từ Ant Design.
 * Giúp đồng nhất phong cách nút bấm trong toàn bộ dự án.
 */
const BaseButton: React.FC<ButtonProps> = (props) => {
    return (
        <Button
            {...props}
            style={{
                borderRadius: '8px',
                fontWeight: 600,
                height: 'auto',
                padding: '8px 24px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...props.style
            }}
        >
            {props.children}
        </Button>
    );
};

export default BaseButton;
