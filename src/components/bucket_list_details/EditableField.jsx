import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../assets/styles/EditableField.css';

const EditableField = ({
                           value,
                           onSave,
                           isTitle = false,
                           isMultiline = false,
                           placeholder = "Enter text..."
                       }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleEditClick = () => {
        setEditValue(value);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditValue(value);
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        if (!editValue.trim()) {
            return;
        }

        if (editValue === value) {
            setIsEditing(false);
            return;
        }

        setIsUpdating(true);

        try {
            await onSave(editValue);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating field:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    if (isEditing) {
        return (
            <form className={`editable-field-form ${isTitle ? 'title-form' : ''}`} onSubmit={handleSubmitEdit}>
                {isMultiline ? (
                    <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                        disabled={isUpdating}
                        className="editable-field-textarea"
                        placeholder={placeholder}
                        rows={4}
                    />
                ) : (
                    <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                        disabled={isUpdating}
                        className={`editable-field-input ${isTitle ? 'title-input' : ''}`}
                        placeholder={placeholder}
                    />
                )}
                <div className="edit-buttons">
                    <button
                        type="submit"
                        className="save-button"
                        disabled={isUpdating || !editValue.trim()}
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
        );
    }

    return (
        <div className={`editable-field ${isTitle ? 'title-field' : ''}`}>
            {isTitle ? (
                <h1>{value || placeholder}</h1>
            ) : (
                <p>{value || <span className="placeholder-text">{placeholder}</span>}</p>
            )}
            <button
                className="edit-field-button"
                onClick={handleEditClick}
                aria-label={`Edit ${isTitle ? 'title' : 'description'}`}
            >
                ✏️
            </button>
        </div>
    );
};

EditableField.propTypes = {
    value: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    isTitle: PropTypes.bool,
    isMultiline: PropTypes.bool,
    placeholder: PropTypes.string
};

export default EditableField;