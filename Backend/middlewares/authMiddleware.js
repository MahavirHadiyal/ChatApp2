import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Not Authorized",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    req.user = user;

    next();

  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Not authorized",
    });
  }
};

export default authMiddleware;