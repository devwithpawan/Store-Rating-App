import db from "../config/db.js";

// CREATE RATING
export const createRating = (req, res) => {
    const userId = req.user.id;
    const { storeId, rating } = req.body;

    if (!storeId || !rating) {
        return res.status(400).json({
            message: "Store ID and rating are required",
        });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({
            message: "Rating must be between 1 and 5",
        });
    }

    const checkQuery = `
        SELECT id
        FROM ratings
        WHERE user_id = ? AND store_id = ?
    `;

    db.query(
        checkQuery,
        [userId, storeId],
        (err, results) => {
            if (err) {
                console.error("CHECK RATING ERROR:", err);

                return res.status(500).json({
                    message: "Database error",
                });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    message: "You have already rated this store",
                });
            }

            const insertQuery = `
                INSERT INTO ratings
                (user_id, store_id, rating)
                VALUES (?, ?, ?)
            `;

            db.query(
                insertQuery,
                [userId, storeId, rating],
                (err) => {
                    if (err) {
                        console.error(
                            "CREATE RATING ERROR:",
                            err
                        );

                        return res.status(500).json({
                            message: "Failed to submit rating",
                        });
                    }

                    return res.status(201).json({
                        message: "Rating submitted successfully",
                    });
                }
            );
        }
    );
};


// UPDATE RATING
export const updateRating = (req, res) => {
    const userId = req.user.id;
    const { storeId } = req.params;
    const { rating } = req.body;

    console.log("UPDATE RATING");
    console.log("userId:", userId);
    console.log("storeId:", storeId);
    console.log("rating:", rating);

    if (!rating) {
        return res.status(400).json({
            message: "Rating is required",
        });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({
            message: "Rating must be between 1 and 5",
        });
    }

    const updateQuery = `
        UPDATE ratings
        SET rating = ?
        WHERE user_id = ? AND store_id = ?
    `;

    db.query(
        updateQuery,
        [rating, userId, storeId],
        (err, result) => {
            if (err) {
                console.error(
                    "UPDATE RATING ERROR:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to update rating",
                    error: err.message,
                });
            }

            console.log("UPDATE RESULT:", result);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Rating not found",
                });
            }

            return res.status(200).json({
                message: "Rating updated successfully",
            });
        }
    );
};