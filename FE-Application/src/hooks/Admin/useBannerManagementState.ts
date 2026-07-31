import {useState} from "react";
import {Form} from "antd";
import type {UploadFile} from "antd";
import {bannerApi} from "../../api/bannerApi";
import type {Banner} from "../../types/banner";
import {notification} from "../../utils/notification";
import {BANNER_STRINGS} from "../../constants/Admin/banner-management";
import {getErrorMessage} from "../../utils/error";
import {uploadImageIfNeeded} from "../../utils/upload";
import {confirmDelete} from "../common/useConfirmDelete";
import {useAsyncList} from "../common/useFetchOnMount";

export const useBannerManagementState = () => {
    const {
        data: banners,
        loading,
        setLoading,
        refetch: fetchBanners,
    } = useAsyncList(
        () => bannerApi.getAll(),
        BANNER_STRINGS.messages.loadError,
        [] as Banner[],
    );
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [form] = Form.useForm<Partial<Banner>>();

    const handleCreateOrUpdate = async (values: Partial<Banner>) => {
        try {
            setLoading(true);
            const imageUrl = await uploadImageIfNeeded(
                fileList,
                "banner",
                values.imageUrl || "",
            );

            if (!imageUrl) {
                notification.error(BANNER_STRINGS.messages.imageRequired);
                setLoading(false);
                return;
            }

            const payload = {
                ...values,
                imageUrl,
            };

            if (editingId) {
                await bannerApi.update(editingId, payload);
                notification.success(BANNER_STRINGS.messages.updateSuccess);
            } else {
                await bannerApi.create(payload);
                notification.success(BANNER_STRINGS.messages.createSuccess);
            }

            setIsModalVisible(false);
            setEditingId(null);
            form.resetFields();
            setFileList([]);
            fetchBanners();
        } catch (error: unknown) {
            notification.error(
                getErrorMessage(error, BANNER_STRINGS.messages.opError),
            );
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (banner: Banner) => {
        setEditingId(banner.id);
        form.setFieldsValue({
            title: banner.title,
            imageUrl: banner.imageUrl,
            linkUrl: banner.linkUrl,
            sortOrder: banner.sortOrder,
            isActive: banner.isActive,
        });
        setFileList([]);
        setIsModalVisible(true);
    };

    const handleStatusChange = async (
        id: number,
        banner: Banner,
        active: boolean,
    ) => {
        try {
            await bannerApi.update(id, {...banner, isActive: active});
            notification.success(BANNER_STRINGS.messages.statusSuccess);
            fetchBanners();
        } catch (error: unknown) {
            notification.error(
                getErrorMessage(error, BANNER_STRINGS.messages.statusError),
            );
        }
    };

    const handleDelete = (id: number) => {
        confirmDelete({
            title: BANNER_STRINGS.messages.deleteTitle,
            content: BANNER_STRINGS.messages.deleteContent,
            onDelete: () => bannerApi.delete(id),
            successMessage: BANNER_STRINGS.messages.deleteSuccess,
            errorMessage: BANNER_STRINGS.messages.deleteError,
            onSuccess: async () => {
                await fetchBanners();
            },
        });
    };

    const handleAddNew = () => {
        setEditingId(null);
        form.resetFields();
        form.setFieldsValue({sortOrder: 0, isActive: true});
        setFileList([]);
        setIsModalVisible(true);
    };

    return {
        banners,
        loading,
        isModalVisible,
        setIsModalVisible,
        editingId,
        fileList,
        setFileList,
        form,
        handleCreateOrUpdate,
        handleEdit,
        handleStatusChange,
        handleDelete,
        handleAddNew,
    };
};
