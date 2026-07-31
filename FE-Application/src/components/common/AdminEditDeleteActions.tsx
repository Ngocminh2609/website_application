import React from "react";
import {Space, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import BaseButton from "./BaseButton";

interface Props {
    onEdit?: () => void;
    onDelete: () => void;
    editTooltip?: string;
    deleteTooltip?: string;
    showEdit?: boolean;
}

const AdminEditDeleteActions: React.FC<Props> = ({
    onEdit,
    onDelete,
    editTooltip = "Chỉnh sửa",
    deleteTooltip = "Xóa",
    showEdit = false,
}) => (
    <Space size="small">
        {showEdit && onEdit && (
            <Tooltip title={editTooltip}>
                <BaseButton type="text" icon={<EditOutlined/>} onClick={onEdit}/>
            </Tooltip>
        )}
        <Tooltip title={deleteTooltip}>
            <BaseButton type="text" icon={<DeleteOutlined/>} danger onClick={onDelete}/>
        </Tooltip>
    </Space>
);

export default AdminEditDeleteActions;
