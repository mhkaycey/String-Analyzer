import { config } from "dotenv";
import process from "process";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });
config();

export const {
    PORT,
    SERVER_URL,
} = process.env;