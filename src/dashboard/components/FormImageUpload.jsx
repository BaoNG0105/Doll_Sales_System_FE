import React, { useState, useEffect } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

// Thông tin Cloudinary của bạn
const CLOUD_NAME = 'dygipvoal';
const UPLOAD_PRESET = 'doll-ai-store';

const FormImageUpload = ({ value, onChange }) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(value);

    // Cập nhật ảnh khi giá trị từ form thay đổi (khi mở modal edit lên)
    useEffect(() => {
        setImageUrl(value);
    }, [value]);

    const handleCustomRequest = async ({ file, onSuccess, onError }) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error('Upload ảnh thất bại.');
            }

            const data = await response.json();
            const newImageUrl = data.secure_url;

            setImageUrl(newImageUrl);
            onChange(newImageUrl); // Cập nhật giá trị cho Form
            onSuccess(data, file);
            message.success(`${file.name} file uploaded successfully.`);
        } catch (error) {
            onError(error);
            message.error(`${file.name} file upload failed.`);
        } finally {
            setLoading(false);
        }
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            customRequest={handleCustomRequest}
            beforeUpload={beforeUpload}
        >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
    );
};

export default FormImageUpload;