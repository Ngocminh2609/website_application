import React, { useState } from 'react';
import { useCompare } from '../../hooks/useCompare';
import { Button, Badge, Tooltip } from 'antd';
import { SwapOutlined, CloseOutlined, DeleteOutlined, ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

/**
 * CompareBar - UX độc đáo: Thanh so sánh nổi phía dưới màn hình với hiệu ứng mượt mà.
 */
const CompareBar: React.FC = () => {
    const { compareItems, removeFromCompare, clearCompare } = useCompare();
    const [isExpanded, setIsExpanded] = useState(true);
    const navigate = useNavigate();
    const fallbackImage = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800';

    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        if (target.dataset.errored === 'true') return;
        target.dataset.errored = 'true';
        target.src = fallbackImage;
    };

    if (compareItems.length === 0) return null;

    return (
        <div
            className={`compare-bar ${isExpanded ? 'expanded' : 'collapsed'}`}
            style={{
                position: 'fixed',
                bottom: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                width: isExpanded ? 'max-content' : '60px',
                maxWidth: '90vw'
            }}
        >
            <div style={{
                background: 'rgba(20, 20, 20, 0.85)',
                backdropFilter: 'blur(12px)',
                borderRadius: '24px',
                padding: isExpanded ? '12px 24px' : '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                overflow: 'hidden'
            }}>
                {/* Nút Thu gọn/Mở rộng */}
                <Button
                    type="text"
                    icon={isExpanded ? <ShrinkOutlined /> : <ArrowsAltOutlined />}
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{ color: '#fff' }}
                />

                {isExpanded && (
                    <>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            {compareItems.map(item => (
                                <div key={item.id} style={{ position: 'relative', width: '50px', height: '50px' }}>
                                    <Badge
                                        count={<CloseOutlined style={{ color: '#fff', fontSize: '10px', cursor: 'pointer', background: '#ff4d4f', borderRadius: '50%', padding: '2px' }} />}
                                        onClick={() => removeFromCompare(item.id)}
                                        offset={[-5, 5]}
                                    >
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            onError={handleImgError}
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '12px',
                                                objectFit: 'cover',
                                                border: '2px solid rgba(255, 255, 255, 0.2)'
                                            }}
                                        />
                                    </Badge>
                                </div>
                            ))}
                            {/* Chốt giữ chỗ nếu chưa đủ 4 */}
                            {Array.from({ length: 4 - compareItems.length }).map((_, i) => (
                                <div key={i} style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '12px',
                                    border: '2px dashed rgba(255, 255, 255, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'rgba(255, 255, 255, 0.1)'
                                }}>
                                    <SwapOutlined />
                                </div>
                            ))}
                        </div>

                        <div className="compare-actions" style={{ display: 'flex', gap: '8px' }}>
                            <Button
                                type="primary"
                                icon={<SwapOutlined />}
                                disabled={compareItems.length < 2}
                                onClick={() => navigate('/compare')}
                                style={{ borderRadius: '12px', fontWeight: 600 }}
                            >
                                So Sánh Ngay ({compareItems.length})
                            </Button>
                            <Tooltip title="Xóa tất cả">
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={clearCompare}
                                    style={{ borderRadius: '12px' }}
                                />
                            </Tooltip>
                        </div>
                    </>
                )}

                {!isExpanded && (
                    <Badge count={compareItems.length} offset={[5, -5]}>
                        <SwapOutlined style={{ color: '#fff', fontSize: '24px' }} onClick={() => setIsExpanded(true)} />
                    </Badge>
                )}
            </div>
        </div>
    );
};

export default CompareBar;
