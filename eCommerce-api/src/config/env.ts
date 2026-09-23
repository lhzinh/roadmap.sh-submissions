import "dotenv/config";
import * as z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(8080),
  JWT_SECRET: z.string().min(32),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export default parsed.data;