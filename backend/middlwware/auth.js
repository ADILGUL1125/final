import jwt from "jsonwebtoken";

// Middleware to protect routes
export const verifyToken = (req, res, next) => {
  try {
    // ✅ Get token from HTTP-only cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized, token missing" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user info to request
    req.userid = decoded.id; // decoded contains { id: user._id, role: user.role }
    req.userrole = decoded.role; // Attach role for admin checks

    next(); // allow route to continue
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ message: "Unauthorized, invalid token" });
  }
};
