import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../../assets/styles/BucketListCard.css';

const BucketListCard = ({ bucketList }) => {
    // Check if items exist and display up to 3
    const displayItems = bucketList.items?.slice(0, 3) || [];
    const hasMoreItems = bucketList.items?.length > 3;

    return (
        <div className="bucket-list-card">
            <div className="bucket-list-card-header">
                <h3 className="bucket-list-title">{bucketList.title}</h3>
                {bucketList.is_private ? (
                    <span className="privacy-indicator private" title="Private">🔒</span>
                ) : (
                    <span className="privacy-indicator public" title="Public">🌐</span>
                )}
            </div>

            <div className="bucket-list-description">
                {bucketList.description && (
                    <p>{bucketList.description.length > 80
                        ? `${bucketList.description.substring(0, 80)}...`
                        : bucketList.description}
                    </p>
                )}
            </div>

            <div className="bucket-list-items">
                {displayItems.length > 0 ? (
                    <ul>
                        {displayItems.map(item => (
                            <li key={item.id} className={item.is_completed ? 'completed' : ''}>
                                {item.content.length > 40
                                    ? `${item.content.substring(0, 40)}...`
                                    : item.content}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-items">No items yet</p>
                )}

                {hasMoreItems && (
                    <div className="more-items">...</div>
                )}
            </div>

            <div className="bucket-list-footer">
        <span className="creation-date">
          Created: {new Date(bucketList.date_created).toLocaleDateString()}
        </span>
                <Link to={`/bucket-list/${bucketList.id}`} className="view-button">
                    View
                </Link>
            </div>
        </div>
    );
};

BucketListCard.propTypes = {
    bucketList: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        created_by: PropTypes.number.isRequired,
        date_created: PropTypes.string.isRequired,
        is_private: PropTypes.bool.isRequired,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                content: PropTypes.string.isRequired,
                is_completed: PropTypes.bool.isRequired
            })
        )
    }).isRequired
};

export default BucketListCard;