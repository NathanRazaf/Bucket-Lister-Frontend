import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../dashboard_components/Header';
import BucketItem from './BucketItem';
import EditableField from './EditableField';
import '../../assets/styles/BucketListDetail.css';

// Import existing API functions
import { getFullBucketList } from '../../functions/bucketListUses.js';
import {
    updateBucketItem,
    deleteBucketItem,
    createBucketItem,
    toggleBucketItem
} from '../../functions/backend/bucket_item_functions.js';
import {
    updateBucketList,
    deleteBucketList,
    shareBucketList
} from '../../functions/backend/bucket_list_functions.js';

const BucketListDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bucketList, setBucketList] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [unauthorized, setUnauthorized] = useState(false);
    const [newItemContent, setNewItemContent] = useState('');
    const [addingItem, setAddingItem] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    useEffect(() => {
        fetchBucketList();
    }, [id]);

    const fetchBucketList = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                setUnauthorized(true);
                return;
            }

            const data = await getFullBucketList(token, id);
            setBucketList(data.bucketList);
            setItems(data.items);
        } catch (err) {
            console.error('Error fetching bucket list:', err);
            if (err.statusCode === 401 || err.statusCode === 403) {
                setUnauthorized(true);
            } else {
                setError(err.message || 'Failed to load bucket list. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTitle = async (newTitle) => {
        try {
            const token = localStorage.getItem('token');
            await updateBucketList(
                token,
                bucketList.id,
                newTitle,
                bucketList.description || '',
                bucketList.is_private
            );

            setBucketList(prev => ({ ...prev, title: newTitle }));
        } catch (err) {
            console.error('Error updating title:', err);
            setError(err.message || 'Failed to update title. Please try again.');
            throw err;
        }
    };

    const handleUpdateDescription = async (newDescription) => {
        try {
            const token = localStorage.getItem('token');
            await updateBucketList(
                token,
                bucketList.id,
                bucketList.title,
                newDescription,
                bucketList.is_private
            );

            setBucketList(prev => ({ ...prev, description: newDescription }));
        } catch (err) {
            console.error('Error updating description:', err);
            setError(err.message || 'Failed to update description. Please try again.');
            throw err;
        }
    };

    const handleToggleComplete = async (itemId) => {
        try {
            const token = localStorage.getItem('token');
            await toggleBucketItem(token, bucketList.id, itemId);

            // Update local state to reflect the change
            setItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId ? {...item, is_completed: !item.is_completed} : item
                )
            );
        } catch (err) {
            console.error('Error toggling item:', err);
            setError(err.message || 'Failed to update item. Please try again.');
        }
    };

    const handleUpdateItem = async (itemId, newContent) => {
        try {
            const token = localStorage.getItem('token');
            const updatedItem = await updateBucketItem(
                token,
                bucketList.id,
                itemId,
                newContent,
                // Preserve the current completion status
                items.find(item => item.id === itemId)?.is_completed || false
            );

            // Update the item in the local state
            setItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId ? {...item, content: newContent} : item
                )
            );

            return updatedItem;
        } catch (err) {
            console.error('Error updating item:', err);
            setError(err.message || 'Failed to update item. Please try again.');
            throw err;
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItemContent.trim()) return;

        try {
            setAddingItem(true);
            const token = localStorage.getItem('token');
            const newItem = await createBucketItem(token, bucketList.id, newItemContent);

            // Add the new item to the local state
            setItems(prevItems => [...prevItems, newItem]);
            setNewItemContent('');
        } catch (err) {
            console.error('Error adding item:', err);
            setError(err.message || 'Failed to add item. Please try again.');
        } finally {
            setAddingItem(false);
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            const token = localStorage.getItem('token');
            await deleteBucketItem(token, bucketList.id, itemId);

            // Remove the item from local state
            setItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } catch (err) {
            console.error('Error deleting item:', err);
            setError(err.message || 'Failed to delete item. Please try again.');
        }
    };

    const handleDeleteBucketList = async () => {
        if (!window.confirm('Are you sure you want to delete this bucket list? This action cannot be undone.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await deleteBucketList(token, bucketList.id);

            // Navigate back to dashboard after successful deletion
            navigate('/dashboard');
        } catch (err) {
            console.error('Error deleting bucket list:', err);
            setError(err.message || 'Failed to delete bucket list. Please try again.');
        }
    };

    const handleShare = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await shareBucketList(token, bucketList.id);

            const shareToken = response.share_token;
            const shareLink = `${window.location.origin}/shared/${shareToken}`;

            setShareUrl(shareLink);
            setIsShareModalOpen(true);
        } catch (err) {
            console.error('Error sharing bucket list:', err);
            setError(err.message || 'Failed to generate share link. Please try again.');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        alert('Share link copied to clipboard!');
    };

    // Redirect to login if unauthorized
    if (unauthorized) {
        navigate('/login', { state: { from: `/bucket-list/${id}` } });
        return null;
    }

    if (loading) {
        return (
            <div className="bucket-list-detail">
                <Header />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading bucket list...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bucket-list-detail">
                <Header />
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button onClick={fetchBucketList} className="retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!bucketList) {
        return (
            <div className="bucket-list-detail">
                <Header />
                <div className="error-container">
                    <p className="error-message">Bucket list not found</p>
                    <button onClick={() => navigate('/dashboard')} className="retry-button">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bucket-list-detail">
            <Header />

            <main className="bucket-list-content">
                <div className="bucket-list-header">
                    <div className="title-section">
                        <EditableField
                            value={bucketList.title}
                            onSave={handleUpdateTitle}
                            isTitle={true}
                            placeholder="Enter a title for your bucket list"
                        />
                        <span className={`privacy-badge ${bucketList.is_private ? 'private' : 'public'}`}>
                          {bucketList.is_private ? '🔒 Private' : '🌐 Public'}
                        </span>
                    </div>

                    <div className="action-buttons">
                        <button className="share-button" onClick={handleShare}>Share</button>
                        <button className="delete-button" onClick={handleDeleteBucketList}>Delete</button>
                    </div>
                </div>

                <div className="bucket-list-description-full">
                    <EditableField
                        value={bucketList.description || ''}
                        onSave={handleUpdateDescription}
                        isMultiline={true}
                        placeholder="Add a description for your bucket list..."
                    />
                </div>

                <div className="bucket-list-items-container">
                    <h2>Items</h2>

                    {items && items.length > 0 ? (
                        <ul className="bucket-list-items-full">
                            {items.map(item => (
                                <BucketItem
                                    key={item.id}
                                    item={item}
                                    onToggleComplete={handleToggleComplete}
                                    onUpdateItem={handleUpdateItem}
                                    onDeleteItem={handleDeleteItem}
                                />
                            ))}
                        </ul>
                    ) : (
                        <div className="empty-items">
                            <p>This bucket list doesn't have any items yet.</p>
                        </div>
                    )}

                    <form className="add-item-form" onSubmit={handleAddItem}>
                        <input
                            type="text"
                            placeholder="Add a new item..."
                            value={newItemContent}
                            onChange={(e) => setNewItemContent(e.target.value)}
                            disabled={addingItem}
                        />
                        <button type="submit" disabled={addingItem || !newItemContent.trim()}>
                            {addingItem ? 'Adding...' : 'Add Item'}
                        </button>
                    </form>
                </div>

                <div className="bucket-list-meta">
                    <p>
                        <strong>Created:</strong> {new Date(bucketList.date_created).toLocaleDateString()}
                    </p>
                </div>
            </main>

            {/* Share Modal */}
            {isShareModalOpen && (
                <div className="share-modal-overlay">
                    <div className="share-modal">
                        <h3>Share Your Bucket List</h3>
                        <p>Share this link with friends to let them view your bucket list:</p>

                        <div className="share-link-container">
                            <input
                                type="text"
                                value={shareUrl}
                                readOnly
                                onClick={(e) => e.target.select()}
                            />
                            <button onClick={copyToClipboard} className="copy-button">
                                Copy
                            </button>
                        </div>

                        <button
                            onClick={() => setIsShareModalOpen(false)}
                            className="close-button"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BucketListDetail;