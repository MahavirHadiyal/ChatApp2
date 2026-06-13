import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "../lib/prisma.js";
import generateUniqueConnectcode from "../utils/generateUnicode.js";

class AuthController {
  static async register(req, res) {
    try {
      const { fullName, username, email, password } = req.body;

      if (!fullName || !username || !email || !password) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must be atleast 6 characters",
        });
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username },
            { email }
          ]
        }
      });

      if (existingUser) {
        return res.status(400).json({
          message: "User already exists with that username or email",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(password, salt);

      await prisma.user.create({
        data: {
          connectCode: await generateUniqueConnectcode(),
          fullName,
          username,
          email,
          password: hashPass,
        },
      });

      res.status(201).json({
        success: true,
      });

    } catch (error) {
      console.log("Registration error", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "Invalid Credentials",
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(400).json({
          message: "Invalid Credentials",
        });
      }

      const isValid = await bcrypt.compare(
        password,
        user.password
      );

      if (!isValid) {
        return res.status(400).json({
          message: "Invalid Credentials",
        });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
      });

      res.status(200).json({
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          connectCode: user.connectCode,
        },
      });

    } catch (error) {
      console.log("Login error", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  static async me(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
      });

      if (!user) {
        return res.status(404).json({
          message: "User Not Found",
        });
      }

      res.status(200).json({
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          connectCode: user.connectCode,
        },
      });

    } catch (error) {
      console.log("Me error", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  static async logout(req, res) {
    res.cookie("jwt", "", {
      maxAge: 0,
    });

    res.json({
      message: "Logged out successfully!",
    });
  }
}

export default AuthController;