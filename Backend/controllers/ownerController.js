
// import db from "../config/db.js";

// OWNER DASHBOARD
// const getOwnerDashboard = async (req, res) => {
//   try {
//     //tem
//     console.log("========== OWNER CONTROLLER ==========");
//     console.log("REQ.USER:", req.user);

//     const ownerId = req.user.id;
//     console.log("OWNER ID:", ownerId);

//     // Get all stores owned by this owner
//     const [stores] = await db.promise().query(
//       `SELECT id, name, email, address
//      FROM stores
//      WHERE owner_id = ?
//      ORDER BY name ASC`,
//       [ownerId]
//     );

//     console.log("STORES:", stores);

//     if (stores.length === 0) {
//       return res.status(200).json({
//         stores: [],
//         totalStores: 0,
//         averageRating: 0,
//         totalRatings: 0,
//         ratings: []
//       });
//     }

//      const storeIds = stores.map((store) => store.id);
//       const placeholders = storeIds
//       .map(() => "?")
//       .join(",");

//     console.log("STORE IDS:", storeIds);

//     // Get ratings for all stores
//     const [ratings] = await db.promise().query(
//       `
//             SELECT
//                 r.id,
//                 r.store_id,
//                 r.user_id,
//                 r.rating,
//                 r.created_at,
//                 u.name,
//                 u.email,
//                 s.name AS store_name
//             FROM ratings r
//             JOIN users u
//                 ON r.user_id = u.id
//             JOIN stores s
//                 ON r.store_id = s.id
//                  WHERE r.store_id IN (${placeholders})
//             ORDER BY r.created_at DESC
//             `,
//       storeIds
//     );
    
//     //isko abi kiya
//     const store = stores[0];
//     console.log("STORE FOUND:", store);


//     // Get average rating
//     const [[ratingData]] = await db.promise().query(
//       `SELECT
//            COALESCE(AVG(rating), 0) AS averageRating,
//            COUNT(*) AS totalRatings
//          FROM ratings
//          WHERE store_id = ?`,
//       [store.id]
//     );


//     // Get users who submitted ratings
//     const [ratingUsers] = await db.promise().query(
//       `SELECT u.id AS userId,
//            u.name,
//            u.email,
//            r.rating,
//            r.created_at
//          FROM ratings r
//          INNER JOIN users u
//            ON r.user_id = u.id
//          WHERE r.store_id = ?
//          ORDER BY r.created_at DESC`,
//       [store.id]
//     );

//     res.status(200).json({
//       store: {
//         id: store.id,
//         name: store.name,
//         email: store.email,
//         address: store.address,
//       },

//       averageRating: Number(ratingData.averageRating),
//       totalRatings: ratingData.totalRatings,
//       ratings: ratingUsers,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       message: "Failed to load owner dashboard",
//     });
//   }
// };




// const getOwnerDashboard = async (req, res) => {
//   try {
//     console.log("========== OWNER CONTROLLER ==========");
//     console.log("REQ.USER:", req.user);

//     const ownerId = req.user.id;

//     console.log("OWNER ID:", ownerId);

//     // ==========================================
//     // 1. GET ALL STORES OF OWNER
//     // ==========================================

//     const [stores] = await db.promise().query(
//       `
//       SELECT
//         id,
//         name,
//         email,
//         address
//       FROM stores
//       WHERE owner_id = ?
//       ORDER BY name ASC
//       `,
//       [ownerId]
//     );

//     console.log("STORES:", stores);

//     // ==========================================
//     // 2. NO STORE
//     // ==========================================

//     if (stores.length === 0) {
//       return res.status(200).json({
//         stores: [],
//         totalStores: 0,
//         averageRating: 0,
//         totalRatings: 0,
//         ratings: []
//       });
//     }

//     // ==========================================
//     // 3. STORE IDS
//     // ==========================================

//     const storeIds = stores.map((store) => store.id);

//     const placeholders = storeIds
//       .map(() => "?")
//       .join(",");

//     console.log("STORE IDS:", storeIds);

//     // ==========================================
//     // 4. GET ALL RATINGS
//     // ==========================================

//     const [ratings] = await db.promise().query(
//       `
//       SELECT
//         r.id,
//         r.store_id,
//         r.user_id,
//         r.rating,
//         r.created_at,

//         u.name,
//         u.email,

//         s.name AS store_name

//       FROM ratings r

//       INNER JOIN users u
//         ON r.user_id = u.id

//       INNER JOIN stores s
//         ON r.store_id = s.id

//       WHERE r.store_id IN (${placeholders})

//       ORDER BY r.created_at DESC
//       `,
//       storeIds
//     );

//     console.log("ALL RATINGS:", ratings);

//     // ==========================================
//     // 5. OVERALL RATING OF ALL STORES
//     // ==========================================

//     const [ratingData] = await db.promise().query(
//       `
//       SELECT
//         COALESCE(AVG(r.rating), 0) AS averageRating,
//         COUNT(r.id) AS totalRatings

//       FROM ratings r

//       WHERE r.store_id IN (${placeholders})
//       `,
//       storeIds
//     );

//     console.log("OVERALL RATING:", ratingData);

//     // ==========================================
//     // 6. RATING FOR EACH STORE
//     // ==========================================

//     const [storeRatingData] = await db.promise().query(
//       `
//       SELECT
//         s.id AS store_id,
//         s.name AS store_name,

//         COALESCE(AVG(r.rating), 0) AS average_rating,

//         COUNT(r.id) AS total_ratings

//       FROM stores s

//       LEFT JOIN ratings r
//         ON s.id = r.store_id

//       WHERE s.owner_id = ?

//       GROUP BY
//         s.id,
//         s.name

//       ORDER BY s.name ASC
//       `,
//       [ownerId]
//     );

//     console.log(
//       "STORE RATING DATA:",
//       storeRatingData
//     );

//     // ==========================================
//     // 7. ADD RATING DATA TO EACH STORE
//     // ==========================================

//     const storesWithRatings = stores.map((store) => {

//       const ratingInfo = storeRatingData.find(
//         (item) =>
//           Number(item.store_id) === Number(store.id)
//       );

//       return {
//         id: store.id,
//         name: store.name,
//         email: store.email,
//         address: store.address,

//         averageRating: Number(
//           ratingInfo?.average_rating || 0
//         ),

//         totalRatings: Number(
//           ratingInfo?.total_ratings || 0
//         )
//       };
//     });

//     console.log(
//       "STORES WITH RATINGS:",
//       storesWithRatings
//     );

//     // ==========================================
//     // 8. FINAL RESPONSE
//     // ==========================================

//     return res.status(200).json({

//       stores: storesWithRatings,

//       totalStores: storesWithRatings.length,

//       averageRating: Number(
//         ratingData[0]?.averageRating || 0
//       ),

//       totalRatings: Number(
//         ratingData[0]?.totalRatings || 0
//       ),

//       ratings: ratings

//     });

//   } catch (error) {

//     console.error(
//       "OWNER DASHBOARD ERROR:",
//       error
//     );

//     return res.status(500).json({
//       message: "Failed to load owner dashboard",
//       error: error.message
//     });
//   }
// };


import db from "../config/db.js";
const getOwnerDashboard = async (req, res) => {
  try {
    console.log("========== OWNER CONTROLLER ==========");
    console.log("REQ.USER:", req.user);

    const ownerId = req.user.id;

    console.log("OWNER ID:", ownerId);

    const [stores] = await db.promise().query(
      `
      SELECT
        id,
        name,
        email,
        address
      FROM stores
      WHERE owner_id = ?
      ORDER BY name ASC
      `,
      [ownerId]
    );

    console.log("STORES:", stores);

    if (stores.length === 0) {
      return res.status(200).json({
        stores: [],
        totalStores: 0,
        averageRating: 0,
        totalRatings: 0,
        ratings: [],
      });
    }

    const storeIds = stores.map((store) => store.id);

    const placeholders = storeIds
      .map(() => "?")
      .join(",");

    console.log("STORE IDS:", storeIds);

    const [ratings] = await db.promise().query(
      `
      SELECT
        r.id,
        r.store_id,
        r.user_id,
        r.rating,
        r.created_at,
        u.name,
        u.email,
        s.name AS store_name
      FROM ratings r
      INNER JOIN users u
        ON r.user_id = u.id
      INNER JOIN stores s
        ON r.store_id = s.id
      WHERE r.store_id IN (${placeholders})
      ORDER BY r.created_at DESC
      `,
      storeIds
    );

    console.log("ALL RATINGS:", ratings);

    const [ratingData] = await db.promise().query(
      `
      SELECT
        COALESCE(AVG(r.rating), 0) AS averageRating,
        COUNT(r.id) AS totalRatings
      FROM ratings r
      WHERE r.store_id IN (${placeholders})
      `,
      storeIds
    );

    console.log("OVERALL RATING:", ratingData);

    const [storeRatingData] = await db.promise().query(
      `
      SELECT
        s.id AS store_id,
        s.name AS store_name,
        COALESCE(AVG(r.rating), 0) AS average_rating,
        COUNT(r.id) AS total_ratings
      FROM stores s
      LEFT JOIN ratings r
        ON s.id = r.store_id
      WHERE s.owner_id = ?
      GROUP BY s.id, s.name
      ORDER BY s.name ASC
      `,
      [ownerId]
    );

    console.log("STORE RATING DATA:", storeRatingData);

    const storesWithRatings = stores.map((store) => {
      const ratingInfo = storeRatingData.find(
        (item) =>
          Number(item.store_id) === Number(store.id)
      );

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: Number(
          ratingInfo?.average_rating || 0
        ),
        totalRatings: Number(
          ratingInfo?.total_ratings || 0
        ),
      };
    });

    console.log(
      "STORES WITH RATINGS:",
      storesWithRatings
    );

    return res.status(200).json({
      stores: storesWithRatings,
      totalStores: storesWithRatings.length,
      averageRating: Number(
        ratingData[0]?.averageRating || 0
      ),
      totalRatings: Number(
        ratingData[0]?.totalRatings || 0
      ),
      ratings,
    });

  } catch (error) {
    console.error(
      "OWNER DASHBOARD ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to load owner dashboard",
      error: error.message,
    });
  }
};


export default getOwnerDashboard;