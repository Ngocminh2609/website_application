import React from 'react';
import { Input } from 'antd';
import type { InputProps } from 'antd';
import type { PasswordProps } from 'antd/es/input';

/**
 * Thành phần Input dùng chung được tùy chỉnh từ Ant Design.
 */
const BaseInput: React.FC<InputProps> & { Password: React.FC<PasswordProps> } = (props) => {
    return (
        <Input
            {...props}
            style={{
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                ...props.style
            }}
        />
    );
};

/**
 * Thành phần Input.Password dùng chung.
 */
BaseInput.Password = (props: PasswordProps) => {
    return (
        <Input.Password
            {...props}
            style={{
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                ...props.style
            }}
        />
    );
};

export default BaseInput;
