import app from "./server";

const PORT = 4500;

const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
