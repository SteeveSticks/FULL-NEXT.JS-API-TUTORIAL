import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    title: { type: "string", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
