import '../assets/styles/Dashboard.css';
import Header from "./dashboard_components/Header.jsx";
import {useState, useEffect} from "react";
import {getAllCollabBucketLists, getAllMyBucketLists} from "../functions/bucketListUses.js";
import BucketListCard from "./dashboard_components/BucketListCard.jsx";
import {Link} from "react-router-dom";
import {getSharedBucketList} from "../functions/backend/bucket_list_functions.js";

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bucketLists, setBucketLists] = useState([]);
    const [collabBucketLists, setCollabBucketLists] = useState([]);
    const [shareCode, setShareCode] = useState('');
    const [shareError, setShareError] = useState('');
    const [shareSuccess, setShareSuccess] = useState('');

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');

                if (!token) {
                    setError("Authentication token not found. Please log in again.");
                    return;
                }

                const [myLists, sharedLists] = await Promise.all([
                    getAllMyBucketLists(token),
                    getAllCollabBucketLists(token)
                ]);

                setBucketLists(myLists);
                setCollabBucketLists(sharedLists);
                setError('');
            } catch (error) {
                console.error("Error fetching bucket lists:", error);
                setError(error.message || "Failed to load bucket lists. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const retryFetchData = () => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                setError(''); // Clear previous error
                const token = localStorage.getItem('token');

                if (!token) {
                    setError("Authentication token not found. Please log in again.");
                    return;
                }

                const [myLists, sharedLists] = await Promise.all([
                    getAllMyBucketLists(token),
                    getAllCollabBucketLists(token)
                ]);

                setBucketLists(myLists);
                setCollabBucketLists(sharedLists);
            } catch (error) {
                console.error("Error fetching bucket lists:", error);
                setError(error.message || "Failed to load bucket lists. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    };

    const handleShareCodeSubmit = async (e) => {
        e.preventDefault();
        setShareError('');
        setShareSuccess('');

        if (!shareCode.trim()) {
            setShareError("Please enter a share code");
            return;
        }

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setShareError("Authentication token not found. Please log in again.");
                return;
            }

            await getSharedBucketList(token, shareCode);

            setShareSuccess("Bucket list added successfully!");
            setShareCode('');

            const sharedLists = await getAllCollabBucketLists(token);
            setCollabBucketLists(sharedLists);
        } catch (error) {
            console.error("Error adding shared bucket list:", error);
            setShareError(error.message || "Failed to add shared bucket list. Please try again later.");
        }
    };

    if (loading) {
        return (
            <div className="dashboard">
                <Header />
                <div className="loading-container full-page-loader">
                    <div className="loading-spinner"></div>
                    <p>Loading your bucket lists...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <Header />

            <main className="dashboard-content">
                {error ? (
                    <div className="error-container">
                        <p className="error-message">{error}</p>
                        <button onClick={retryFetchData} className="retry-button">Try Again</button>
                    </div>
                ) : (
                    <>
                        <div className="bucket-lists-header">
                            <h2>My Bucket Lists</h2>
                            <Link to="/create-bucket-list" className="create-button">Create New List</Link>
                        </div>

                        {bucketLists.length === 0 ? (
                            <div className="empty-state">
                                <h3>You don't have any bucket lists yet!</h3>
                                <p>Create your first bucket list to start tracking your goals and dreams.</p>
                                <button className="create-button">Create My First Bucket List</button>
                            </div>
                        ) : (
                            <div className="bucket-lists-grid">
                                {bucketLists.map(bucketList => (
                                    <BucketListCard
                                        key={bucketList.id}
                                        bucketList={bucketList}
                                    />
                                ))}
                            </div>
                        )}

                        <div className="bucket-lists-section">
                            <div className="bucket-lists-header">
                                <h2>Bucket Lists shared with me</h2>
                            </div>

                            <div className="share-code-form-container">
                                <form onSubmit={handleShareCodeSubmit} className="share-code-form">
                                    <div className="share-code-input-group">
                                        <input
                                            type="text"
                                            className="share-code-input"
                                            placeholder="Enter share code"
                                            value={shareCode}
                                            onChange={(e) => setShareCode(e.target.value)}
                                        />
                                        <button type="submit" className="share-code-button">
                                            Add Shared List
                                        </button>
                                    </div>
                                    {shareError && <p className="share-error-message">{shareError}</p>}
                                    {shareSuccess && <p className="share-success-message">{shareSuccess}</p>}
                                </form>
                            </div>

                            {collabBucketLists.length === 0 ? (
                                <div className="empty-state">
                                    <h3>No bucket list has been shared with you yet!</h3>
                                    <p>Ask a friend to share their bucket list so that you can share the same dreams.</p>
                                </div>
                            ) : (
                                <div className="bucket-lists-grid">
                                    {collabBucketLists.map(bucketList => (
                                        <BucketListCard
                                            key={bucketList.id}
                                            bucketList={bucketList}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;