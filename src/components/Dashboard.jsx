import '../assets/styles/Dashboard.css';
import Header from "./dashboard_components/Header.jsx";
import {useState, useEffect} from "react";
import {getAllMyBucketLists} from "../functions/bucketListUses.js";
import BucketListCard from "./dashboard_components/BucketListCard.jsx";

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bucketLists, setBucketLists] = useState([]);

    useEffect(() => {
        // Fetch bucket lists when component mounts
        fetchBucketLists();
    }, []);

    const fetchBucketLists = async () => {
        try {
            const token = localStorage.getItem('token');
            const lists = await getAllMyBucketLists(token);
            setBucketLists(lists);
        } catch (error) {
            console.error("Error fetching bucket lists:", error);
            setError(error.message || "Failed to load bucket lists");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">
            <Header />

            <main className="dashboard-content">
                <div className="bucket-lists-header">
                    <h2>My Bucket Lists</h2>
                    <button className="create-button">Create New List</button>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading your bucket lists...</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <p className="error-message">{error}</p>
                        <button onClick={fetchBucketLists} className="retry-button">Try Again</button>
                    </div>
                ) : bucketLists.length === 0 ? (
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
            </main>
        </div>
    );
};

export default Dashboard;