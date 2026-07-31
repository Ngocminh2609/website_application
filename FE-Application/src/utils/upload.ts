import type {UploadFile} from "antd";
import {fileApi} from "../api/fileApi";

type ImageBucketType = "product" | "category" | "user" | "banner";

/**
 * Upload ảnh từ Ant Design UploadFile list nếu có originFileObj;
 * nếu không trả về fallbackUrl.
 */
export const uploadImageIfNeeded = async (
    fileList: UploadFile[],
    type: ImageBucketType,
    fallbackUrl: string = "",
): Promise<string> => {
    if (fileList.length > 0 && fileList[0].originFileObj) {
        const uploadRes = await fileApi.uploadImage(
            fileList[0].originFileObj as File,
            type,
        );
        return uploadRes.url;
    }
    return fallbackUrl;
};

/**
 * Upload một File trực tiếp và trả về URL.
 */
export const uploadImageFile = async (
    file: File,
    type: ImageBucketType,
): Promise<string> => {
    const uploadRes = await fileApi.uploadImage(file, type);
    return uploadRes.url;
};
