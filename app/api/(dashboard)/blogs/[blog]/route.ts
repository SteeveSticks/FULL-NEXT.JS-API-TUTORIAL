import { NextResponse } from "next/server";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import connectDB from "@/lib/db";
import { Types } from "mongoose";
import Blog from "@/lib/modals/blog";

export const GET = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

    const categoryId = searchParams.get("categoryId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing CategoryId" }),
        { status: 400 }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blogId" }),
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 400,
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 400 }
      );
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      category: categoryId,
    });

    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found" }), {
        status: 400,
      });
    }

    return new NextResponse(JSON.stringify({ blog }), { status: 200 });
  } catch (error: any) {
    console.log("Error :", error);
    return new NextResponse("Error fetching blog: " + error.message, {
      status: 500,
    });
  }
};

export const PUT = async (request: Request, context: { params: any }) => {
  const blogId = await context.params.blog;
  try {
    const body = await request.json();
    const { title, description } = body;

    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blogId" }),
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 400,
      });
    }

    const blog = await Blog.findOne({ _id: blogId, user: userId });
    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found" }), {
        status: 400,
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        message: "Blog updated successfully",
        blog: updatedBlog,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error :", error);
    return new NextResponse("Error updating blog: " + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blogId" }),
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 400,
      });
    }

    const blog = await Blog.findOne({ _id: blogId, user: userId });

    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found" }), {
        status: 400,
      });
    }

    await Blog.findByIdAndDelete(blogId);

    return new NextResponse(
      JSON.stringify({ message: "Blog is deleted successfully" }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error deleting blog:", error);
    return new NextResponse("Error deleting blog: " + error.message, {
      status: 500,
    });
  }
};
