import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../assets/styles/BucketItem.css';

const BucketItem = ({
                        item,
                        onToggleComplete,
                        onUpdateItem,
                        onDeleteItem
                    }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(item.content);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleEditClick = () => {
        setEditContent(item.content);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditContent(item.content);
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        if (!editContent.trim()) {
            return;
        }

        if (editContent === item.content) {
            setIsEditing(false);
            return;
        }

        setIsUpdating(true);

        try {
            await onUpdateItem(item.id, editContent);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating item:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <li className={`bucket-item ${item.is_completed ? 'completed' : ''}`}>
            <label className="checkbox-container">
                <input
                    type="checkbox"
                    checked={item.is_completed}
                    onChange={() => onToggleComplete(item.id)}
                    disabled={isEditing}
                />
                <span className="checkmark"></span>
            </label>

            {isEditing ? (
                <form className="edit-item-form" onSubmit={handleSubmitEdit}>
                    <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        autoFocus
                        disabled={isUpdating}
                        className="edit-item-input"
                    />
                    <div className="edit-buttons">
                        <button
                            type="submit"
                            className="save-button"
                            disabled={isUpdating || !editContent.trim()}
                        >
                            {isUpdating ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={handleCancelEdit}
                            disabled={isUpdating}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <span className="item-content">{item.content}</span>
                    <div className="item-actions">
                        <button
                            className="edit-item-button"
                            onClick={handleEditClick}
                            aria-label="Edit item"
                        >
                            ✏️
                        </button>
                        <button
                            className="delete-item-button"
                            onClick={() => onDeleteItem(item.id)}
                            aria-label="Delete item"
                        >
                            🗑️
                        </button>
                    </div>
                </>
            )}
        </li>
    );
};

BucketItem.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number.isRequired,
        content: PropTypes.string.isRequired,
        is_completed: PropTypes.bool.isRequired
    }).isRequired,
    onToggleComplete: PropTypes.func.isRequired,
    onUpdateItem: PropTypes.func.isRequired,
    onDeleteItem: PropTypes.func.isRequired
};

export default BucketItem;