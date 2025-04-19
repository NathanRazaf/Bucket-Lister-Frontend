import {ApiError} from "../assets/consts.js";
import {getBucketList, getCollabBucketLists, getMyBucketLists} from "./backend/bucket_list_functions.js";
import {getBucketItems} from "./backend/bucket_item_functions.js";

export const getFullBucketList = async (token, id) => {
    try {
        const bucketList = await getBucketList(token, id);
        const items = await getBucketItems(token, id);
        return {
            bucketList,
            items,
        };
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError("An unexpected error occurred", 500, error.message);
    }
}

export const getAllMyBucketLists = async (token) => {
    try {
        const bucketLists = await getMyBucketLists(token);

        return await Promise.all(bucketLists.map(async (bucketList) => {
            const items = await getBucketItems(token, bucketList.id);
            return {
                ...bucketList,
                items,
            };
        }));
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError("An unexpected error occurred", 500, error.message);
    }
}

export const getAllCollabBucketLists = async (token) => {
    try {
        const bucketLists = await getCollabBucketLists(token);

        return await Promise.all(bucketLists.map(async (bucketList) => {
            const items = await getBucketItems(token, bucketList.id);
            return {
                ...bucketList,
                items,
            };
        }));
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError("An unexpected error occurred", 500, error.message);
    }
}