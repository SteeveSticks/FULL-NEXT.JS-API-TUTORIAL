import mongoose, { model, models } from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    title: { type: "string", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Category = models.Category || model("Category", categorySchema);

export default Category;
