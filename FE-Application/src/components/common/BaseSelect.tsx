import React from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';

/**
 * Thành phần Select dùng chung.
 * Tùy chỉnh để đảm bảo hiển thị đẹp mắt trên nền tối của dự án.
 */
const BaseSelect: React.FC<SelectProps> = (props) => {
    return (
        <Select
            {...props}
            style={{ width: '100%', ...props.style }}
            dropdownStyle={{ backgroundColor: '#1e293b' }}
        />
    );
};

export default BaseSelect;
