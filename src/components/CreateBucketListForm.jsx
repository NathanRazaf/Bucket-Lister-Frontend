import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBucketList } from "../functions/backend/bucket_list_functions.js";
import Header from './dashboard_components/Header';
import '../assets/styles/CreateBucketListForm.css';

const CreateBucketListForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [touched, setTouched] = useState({ title: false, description: false });
    const navigate = useNavigate();

    // Validate form inputs whenever they change
    useEffect(() => {
        // Only validate title if it's been touched
        if (touched.title) {
            if (title.length === 0) {
                setTitleError('Title is required');
            } else if (title.length < 3) {
                setTitleError('Title must be at least 3 characters');
            } else if (title.length > 50) {
                setTitleError('Title must be less than 50 characters');
            } else {
                setTitleError('');
            }
        }

        // Only validate description if it's been touched
        if (touched.description && description.length > 200) {
            setDescriptionError('Description must be less than 200 characters');
        } else {
            setDescriptionError('');
        }
    }, [title, description, touched]);

    const validateForm = () => {
        return title.length >= 3 && title.length <= 50 && description.length <= 200;
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mark all fields as touched for validation
        setTouched({ title: true, description: true });

        if (!validateForm()) {
            setError('Please fix the errors before submitting.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            await createBucketList(token, title, description);
            setSuccess('Bucket List created successfully!');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2500);
        } catch (error) {
            console.error("Error creating bucket list:", error);
            setError(error.message || "Failed to create bucket list");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bucket-list-container">
            <Header />
            <div className="bucket-list-form-container">
                <h2>Create Bucket List</h2>
                <form className="bucket-list-form" onSubmit={handleSubmit}>
                    <div className="form-wrapper">
                        {success && <div className="success-message">{success}</div>}
                        {error && <div className="error-message">{error}</div>}
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={() => handleBlur('title')}
                                className={titleError ? 'input-error' : ''}
                                required
                            />
                            {titleError && <div className="field-error">{titleError}</div>}
                            <div className="character-count">
                                {title.length}/50 characters
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                onBlur={() => handleBlur('description')}
                                className={descriptionError ? 'input-error' : ''}
                            ></textarea>
                            {descriptionError && <div className="field-error">{descriptionError}</div>}
                            <div className="character-count">
                                {description.length}/200 characters
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={!validateForm() || loading}
                        >
                            {loading ? <div className="loading-spinner"></div> : 'Create Bucket List'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBucketListForm;