import admin from "firebase-admin";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import safestopRoutes from "./routes/safestops";
import reportRoutes from "./routes/reports";
import segmentRoutes from "./routes/segments";
import routeRoutes from "./routes/route";
import panicRoutes from "./routes/panic";
import confirmRoutes from "./routes/confirm";
import liveShareRoutes from "./routes/liveshare";
import nominateRoutes from "./routes/nominate";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/", (_req, res) => {
  res.send("HerPath backend is alive");
});
import { db } from "./config/firebase";

app.get("/test-db", async (_req, res) => {
  const snap = await db.listCollections();
  res.json({ collections: snap.map((c: any) => c.id) });
});
app.get("/gemini-test", (_req, res) => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    res.json({ status: "MISSING", message: "Gemini API key not found in .env" });
  } else {
    res.json({ status: "LOADED", message: `Gemini API key loaded (length: ${key.length})` });
  }
});
import { authMiddleware } from "./middleware/auth";

app.get("/protected-test", authMiddleware, (req: any, res) => {
  res.json({ message: "You are authenticated", uid: req.uid });
});
app.use("/api/safestops", safestopRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/segments", segmentRoutes);
app.use("/api/route", routeRoutes);
app.use("/api/panic-reroute", panicRoutes);
app.use("/api/reports", confirmRoutes);
app.use("/api/live-share", liveShareRoutes);
app.use("/api/safestops/nominate", nominateRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

