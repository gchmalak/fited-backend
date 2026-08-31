import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../src/models/user.js";

async function seedOwner() {
  await mongoose.connect(process.env.MONGODB_URI!, {
    auth: {
      username: process.env.MONGODB_USERNAME,
      password: process.env.MONGODB_PASSWORD,
    },
  } as any);

  const email = "gachimalak@icloud.com"; 

  const existing = await User.findOne({ email });

  if (existing) {
    existing.role = "owner";
    await existing.save();
    console.log(`Promoted ${email} to owner.`);
  } else {
    console.log(`No user found with email ${email}. Register that account first, then re-run this script.`);
  }

  await mongoose.disconnect();
}

seedOwner().catch(console.error);