import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) return next(errorHandler(401, "Unauthorized"));

    const user = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
