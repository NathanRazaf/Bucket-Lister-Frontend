import '../assets/styles/Dashboard.css';
import Header from "./dashboard_components/Header.jsx";
import {useState, useEffect} from "react";
import {getAllCollabBucketLists, getAllMyBucketLists} from "../functions/bucketListUses.js";
import BucketListCard from "./dashboard_components/BucketListCard.jsx";

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bucketLists, setBucketLists] = useState([]);
    const [collabBucketLists, setCollabBucketLists] = useState([]);

    useEffect(() => {
        // Fetch all data when component mounts
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');

                // Use Promise.all to fetch both lists concurrently
                const [myLists, sharedLists] = await Promise.all([
                    getAllMyBucketLists(token),
                    getAllCollabBucketLists(token)
                ]);

                setBucketLists(myLists);
                setCollabBucketLists(sharedLists);
                setError('');
            } catch (error) {
                console.error("Error fetching bucket lists:", error);
                setError(error.message || "Failed to load bucket lists");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData().then(r => r);
    }, []);

    const retryFetchData = () => {
        // Function to retry fetching all data
        const fetchAllData = async () => {
            try {
                setLoading(true);
                setError('');
                const token = localStorage.getItem('token');

                const [myLists, sharedLists] = await Promise.all([
                    getAllMyBucketLists(token),
                    getAllCollabBucketLists(token)
                ]);

                setBucketLists(myLists);
                setCollabBucketLists(sharedLists);
            } catch (error) {
                console.error("Error fetching bucket lists:", error);
                setError(error.message || "Failed to load bucket lists");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData().then(r => r);
    };

    // If still loading, show a loading indicator for the entire page
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
                            <button className="create-button">Create New List</button>
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

                        <div className="bucket-lists-header">
                            <h2>Bucket Lists shared with me</h2>
                        </div>

                        {collabBucketLists.length === 0 ? (
                            <div className="empty-state">
                                <h3>No bucket list has been shared with you yet!</h3>
                                <p>Ask a friend to share his bucket list so that you can share the same dreams.</p>
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
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;