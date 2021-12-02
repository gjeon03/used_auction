import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/Product";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = 4500;

const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
