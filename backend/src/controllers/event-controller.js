
import mongoose from "mongoose";
import Event from "../models/event-model.js";

function formatEvent(event) {
  const data = event.toObject();

  return {
    ...data,
    id: event._id.toString(),
  };
}

// GET /events
export async function getEvents(req, res) {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};

    const events = await Event.find(filter).sort({
      date: 1,
    });

    res.status(200).json(events.map(formatEvent));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: {
        message: "Etkinlikler getirilemedi",
      },
    });
  }
}

// GET /events/:id
export async function getEventById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({
        error: {
          message: "Event not found",
        },
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        error: {
          message: "Event not found",
        },
      });
    }

    res.status(200).json(formatEvent(event));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: {
        message: "Etkinlik getirilemedi",
      },
    });
  }
}

// POST /events
export async function createEvent(req, res) {
  try {
    const {
      title,
      category,
      date,
      time,
      location,
      capacity,
      description,
      image,
    } = req.body ?? {};

    if (!title || !category || !date) {
      return res.status(400).json({
        error: {
          message: "title, category and date are required",
        },
      });
    }

    const event = await Event.create({
      title,
      category,
      date,
      time,
      location,
      capacity,
      description,
      image,
    });

    res.status(201).json(formatEvent(event));
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: {
          message: error.message,
        },
      });
    }

    res.status(500).json({
      error: {
        message: "Etkinlik oluşturulamadı",
      },
    });
  }
}
