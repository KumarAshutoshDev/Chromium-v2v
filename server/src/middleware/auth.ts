import { Request, Response, NextFunction } from "express";
import { getAuth } from "firebase-admin/auth";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }

  const token = authHeader.split("Bearer ")[1] as string;
  try {
    const decoded = await getAuth().verifyIdToken(token);
    (req as any).uid = decoded.uid as string;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
