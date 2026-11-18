
import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";

const PORT = process.env.PORT || 3000;

try {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(
      `Kampüs API http://localhost:${PORT} adresinde çalışıyor.`
    );
  });
} catch (error) {
  console.error("MongoDB bağlantı hatası:", error.message);
  process.exit(1);
}
