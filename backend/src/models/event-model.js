
import mongoose from "mongoose";
import { formatDate, parseDate } from "../utils/date.js";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    category: {
      type: String,
      required: true,
      enum: ["Seminer", "Atölye", "Söyleşi", "Yarışma"],
    },
    date: {
      type: Date,
      required: true,
      set: parseDate,
      get: formatDate,
    },
    time: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    capacity: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      default: "",
      maxlength: 500,
    },
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    id: false,
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
