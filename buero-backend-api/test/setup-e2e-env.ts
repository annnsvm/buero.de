import * as dotenv from "dotenv";
import * as path from "path";

// Спочатку вмикаємо режим e2e (Throttler skipIf у AppModule), потім підвантажуємо .env
process.env.E2E_TEST = "true";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

process.env.E2E_TEST = "true";
