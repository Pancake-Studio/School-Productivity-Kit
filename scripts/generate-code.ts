import { prisma } from "../lib/db";
import { randomBytes } from "crypto";

/**
 * Generate a random 8-character access code and save it to the Master DB.
 */
async function generateCode() {
  const code = randomBytes(4).toString("hex").toUpperCase();
  
  try {
    await prisma.schoolAccessCode.create({
      data: {
        code: code,
      },
    });
    console.log("-----------------------------------------");
    console.log(`✅ Success! Generated Access Code: ${code}`);
    console.log("-----------------------------------------");
  } catch (error) {
    console.error("❌ Failed to generate code:", error);
  } finally {
    process.exit();
  }
}

generateCode();
