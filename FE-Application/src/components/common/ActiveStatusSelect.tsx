import React from "react";
import {Select} from "antd";
import type {CSSProperties} from "react";

interface Props {
    value: boolean;
    onChange: (value: boolean) => void;
    activeLabel: string;
    inactiveLabel: string;
    style?: CSSProperties;
}

const ActiveStatusSelect: React.FC<Props> = ({
    value,
    onChange,
    activeLabel,
    inactiveLabel,
    style,
}) => (
    <Select
        value={value}
        onChange={onChange}
        size="small"
        style={style}
        options={[
            {label: activeLabel, value: true},
            {label: inactiveLabel, value: false},
        ]}
        status={value ? undefined : "warning"}
    />
);

export default ActiveStatusSelect;
