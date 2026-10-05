import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import db from "../config/db.js"


//ADMIN DASHBOARD
const getDashboardStats = async (req, res) => {
    try {
        const [[users]] = await db.promise()
            .query("SELECT COUNT(*) AS totalUsers FROM users");


        const [[stores]] = await db.promise()
            .query("SELECT COUNT(*) AS totalStores FROM stores");

        const [[ratings]] = await db.promise()
            .query("SELECT COUNT(*) AS totalRatings FROM ratings");

        res.status(200).json({
            totalUsers: users.totalUsers,
            totalStores: stores.totalStores,
            totalRatings: ratings.totalRatings,
        });

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Failed to load dashboard statistics"
        })
    }
}

//GET USERS

const getUsers = async (req, res) => {
    try {
        const {
            name = "",
            email = "",
            address = "",
            role = "",
            sortBy = "name",
            order = "ASC",
        } = req.query;

        const allowedSortFields = {
            name: "name",
            email: "email",
            address: "address",
            role: "role"
        };

        const sortColumn = allowedSortFields[sortBy] || "name";

        const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

        let query = `SELECT id, name, email, address, role 
        FROM users WHERE name LIKE ? AND email LIKE ? 
        AND address LIKE ?`;

        const values = [
            `%${name}%`,
            `%${email}%`,
            `%${address}%`,
        ];

        if (role) {
            query += `AND role = ?`;
            values.push(role);
        }
        query += `ORDER BY ${sortColumn} ${sortOrder}`;

        const [users] = await db.promise().query(query, values);

        res.status(200).json(users);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to load users"
        })
    }
}


// ADD USER / ADMIN
const createUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            address,
            role = "USER",
        } = req.body;

        if (!name || !email || !password || !address) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        if (!["USER", "ADMIN", "OWNER"].includes(role)) {
            return res.status(400).json({
                message: "Invalid role",
            });
        }

        if (name.length < 20 || name.length > 60) {
            return res.status(400).json({
                message:
                    "Name must be between 20 and 60 characters",
            });
        }

        // const passwordRegex =
        //     /^(?=.[A-Z])(?=.[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,16}$/;

        // if (!passwordRegex.test(password)) {
        //     return res.status(400).json({
        //         message:
        //             "Password must be 8-16 characters with uppercase and special character",
        //     });
        // }

        const [existingUser] = await db
            .promise()
            .query(
                "SELECT id FROM users WHERE email = ?",
                [email]
            );

        if (existingUser.length > 0) {
            return res.status(409).json({
                message: "Email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        await db.promise().query(
            `INSERT INTO users
        (name, email, password, address, role)
        VALUES (?, ?, ?, ?, ?)`,
            [
                name,
                email,
                hashedPassword,
                address,
                role,
            ]
        );

        res.status(201).json({
            message: `${role} created successfully`,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create user",
        });
    }
};

// GET STORES
const getStores = async (req, res) => {
    try {
        const {
            name = "",
            email = "",
            address = "",
            sortBy = "name",
            order = "ASC",
        } = req.query;

        const allowedSortFields = {
            name: "s.name",
            email: "s.email",
            address: "s.address",
            average_rating: "average_rating",
        };

        const sortColumn =
            allowedSortFields[sortBy] || "s.name";

        const orderValue =
            order.toUpperCase() === "DESC"
                ? "DESC"
                : "ASC";

        // const sortOrder =
        //     order.toUpperCase() === "DESC"
        //         ? "DESC"
        //         : "ASC";

        const query = `SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id,
        u.name AS owner_name,
        u.email AS owner_email,
        COALESCE(AVG(r.rating), 0) AS average_rating,
        COUNT(r.id) AS total_ratings
        FROM stores s

       LEFT JOIN users u
       ON s.owner_id = u.id
       LEFT JOIN ratings r
       ON s.id = r.store_id

      WHERE s.name LIKE ?
      AND s.email LIKE ?
      AND s.address LIKE ?
      GROUP BY s.id
      ORDER BY ${sortColumn} ${orderValue}
    `;

        const [stores] = await db
            .promise()
            .query(query, [
                `%${name}%`,
                `%${email}%`,
                `%${address}%`,
            ]);

        res.status(200).json(stores);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to load stores",
        });
    }
};

// ADD STORE
const createStore = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            ownerId,
        } = req.body;

        if (!name || !email || !address || !ownerId) {
            return res.status(400).json({
                message: "Name, email and address and owner are required",
            });
        }

        //check owner exists and is actually an OWNER
        // const [owners] = await db.promise().query(
        //     `SELECT id FROM users
        //     WHERE id = ? AND role = "OWNER"`
        //     [ownerId]
        // );

        if (name.length < 20 || name.length > 60) {
            return res.status(400).json({
                message:
                    "Name must be between 20 and 60 characters",
            });
        }

        const [existingStore] = await db
            .promise()
            .query(
                "SELECT id FROM stores WHERE email = ?",
                [email]
            );

        if (existingStore.length > 0) {
            return res.status(409).json({
                message: "Store email already exists",
            });
        }

        if (ownerId) {
            const [owner] = await db.promise().query(`SELECT id FROM users
           WHERE id = ? AND role = 'OWNER'`,
                [ownerId]
            );

            if (owner.length === 0) {
                return res.status(400).json({
                    message:
                        "Provided ownerId is not a valid Store Owner",
                });
            }
        }

        await db.promise().query(
            `INSERT INTO stores
        (name, email, address, owner_id)
        VALUES (?, ?, ?, ?)`,
            [
                name,
                email,
                address,
                ownerId || null,
            ]
        );

        res.status(201).json({
            message: "Store created successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create store",
        });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const [users] = await db.promise().query(
            `
      SELECT
        id,
        name,
        email,
        address,
        role,
        created_at
      FROM users
      WHERE id = ?
      `,
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = users[0];

        // Agar user Store Owner hai
        if (user.role === "OWNER") {
            const [stores] = await db.promise().query(
                `
        SELECT
          s.id,
          s.name,
          s.email,
          s.address,
          COALESCE(AVG(r.rating), 0) AS average_rating,
          COUNT(r.id) AS total_ratings
        FROM stores s
        LEFT JOIN ratings r
          ON s.id = r.store_id
        WHERE s.owner_id = ?
        GROUP BY s.id
        `,
                [id]
            );

            user.store = stores.length > 0 ? stores[0] : null;
        }

        res.json(user);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get user details"
        });
    }
};

const getOwners = async (req, res) => {
    try {
        const [owners] = await db.promise().query(`
            SELECT id, name, email
            FROM users
            WHERE role = 'OWNER'
            ORDER BY name ASC
        `);

        res.status(200).json(owners);
    } catch (error) {
        console.error("GET OWNERS ERROR:", error);

        res.status(500).json({
            message: "Failed to load owners"
        });
    }
};


export { getDashboardStats, getStores, createStore, createUser, getUsers, getUserDetails, getOwners }