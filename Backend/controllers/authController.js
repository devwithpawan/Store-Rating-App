import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

import db from "../config/db.js"

//Register
const register = async (req, res) => {
    const { name, email, password, address } = req.body;

    if (!name || !email || !password || !address) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (name.length < 20 || name.length > 60) {
        return res.status(400).json({
            message: "Name must be b/w 20 and 60 characters"
        })
    }

    try {

        const [existingUser] = await db.promise().query("SELECT id FROM users WHERE email = ?", [email]);

        if(existingUser.length > 0){
            return res.status(409).json({
                message:"Email already registered",
            });
        }

        //Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create user
        await db.promise()
        .query(`INSERT INTO users(name, email, password, address, role) VALUES(?, ?, ?, ?, 'USER')`,
            [name, email, hashedPassword, address]
        );

        res.status(201).json({
            message: "Registered successful",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
        })
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({
                message: "Email and Password are required"
            })
        }

        const [users] = await db.promise().query(
            "SELECT id, name, email, password, address, role FROM users WHERE email = ?", [email]
        );

        if(users.length === 0) {
            return res.status(400).json({
                message: "Invalid email or password",
            })
        }

        const user = users[0];
        // console.log(user);

        //compare password

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if(!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        //create jwt 
        const token = jwt.sign({
            id: user.id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );
    res.status(200).json({
        message: "Login Successfully",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            address: user.address,
            role: user.role
        }
    })
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        })
    }
}


const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message:
          "Current password and new password are required",
      });
    }

    // Get current password
    const [users] = await db
      .promise()
      .query(
        "SELECT password FROM users WHERE id = ?",
        [userId]
      );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check old password
    const isCorrect = await bcrypt.compare(
      currentPassword,
      users[0].password
    );

    if (!isCorrect) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // Update
    await db
      .promise()
      .query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, userId]
      );

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update password",
    });
  }
};

export {register, login, changePassword}

