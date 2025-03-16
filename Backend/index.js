const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const stockRouter = require("./routes/stockRouter");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/stock", stockRouter);

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
