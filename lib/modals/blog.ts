import mongoose, { model, models } from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  {
    timestamps: true,
  }
);

const Blog = models.Blog || model("Blog", blogSchema);

export default Blog;
