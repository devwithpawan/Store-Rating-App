
import db from "../config/db.js"

const getStores = async (req, res) => {
    try {
        const {
            name = "",
            address = "",
        } = req.query;

        const userId = req.user.id;

        const query = `
            SELECT s.id, s.name, s.address,
                COALESCE( AVG(r.rating), 0) AS average_rating,
                ur.rating AS my_rating
            FROM stores s
            LEFT JOIN ratings r
                ON s.id = r.store_id
            LEFT JOIN ratings ur
                ON s.id = ur.store_id
                AND ur.user_id = ?
            WHERE s.name LIKE ?
            AND s.address LIKE ?
            GROUP BY
                s.id,
                s.name,
                s.address,
                ur.rating
            ORDER BY s.name ASC
        `;

        const [stores] = await db
            .promise()
            .query(query, [
                userId,
                `%${name}%`,
                `%${address}%`,
            ]);

        res.status(200).json(stores);

    } catch (error) {
        console.error("GET STORES ERROR:", error);

        res.status(500).json({
            message: "Failed to load stores",
        });
    }
};


// SUBMIT RATING
const submitRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const storeId = req.params.storeId;
        const { rating } = req.body;

        // Check rating
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5",
            });
        }

        // Check store
        const [stores] = await db
            .promise()
            .query(
                "SELECT id FROM stores WHERE id = ?",
                [storeId]
            );

        if (stores.length === 0) {
            return res.status(404).json({
                message: "Store not found",
            });
        }

        // Check existing rating
        const [existingRating] = await db
            .promise()
            .query(
                `SELECT id
         FROM ratings
         WHERE user_id = ?
         AND store_id = ?`,
                [userId, storeId]
            );

        if (existingRating.length > 0) {
            return res.status(409).json({
                message:
                    "You have already rated this store",
            });
        }

        // Insert rating
        await db
            .promise()
            .query(
                `INSERT INTO ratings
         (user_id, store_id, rating)
         VALUES (?, ?, ?)`,
                [userId, storeId, rating]
            );

        res.status(201).json({
            message: "Rating submitted successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to submit rating",
        });
    }
};


// MODIFY RATING
const updateRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const storeId = req.params.storeId;
        const { rating } = req.body;

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5",
            });
        }

        // Find user's rating
        const [existingRating] = await db
            .promise()
            .query(
                `SELECT id
         FROM ratings
         WHERE user_id = ?
         AND store_id = ?`,
                [userId, storeId]
            );

        if (existingRating.length === 0) {
            return res.status(404).json({
                message: "Rating not found",
            });
        }

        // Update rating
        await db
            .promise()
            .query(
                `UPDATE ratings
         SET rating = ?
         WHERE user_id = ?
         AND store_id = ?`,
                [rating, userId, storeId]
            );

        res.status(200).json({
            message: "Rating updated successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update rating",
        });
    }
};

export { getStores, submitRating, updateRating };