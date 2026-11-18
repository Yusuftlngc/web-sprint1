
import "dotenv/config";
import mongoose from "mongoose";

import { connectDatabase } from "./config/database.js";
import Event from "./models/event-model.js";
import { seedEvents } from "./data/seed-events.js";

async function seed() {
  try {
    await connectDatabase();

    if (seedEvents.length !== 6) {
      throw new Error(
        "Seed dosyasında tam olarak 6 etkinlik bulunmalı."
      );
    }

    await Event.deleteMany({});

    const created = await Event.insertMany(seedEvents);

    console.log(
      `${created.length} etkinlik MongoDB'ye eklendi.`
    );
  } catch (error) {
    console.error("Seed hatası:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

await seed();
