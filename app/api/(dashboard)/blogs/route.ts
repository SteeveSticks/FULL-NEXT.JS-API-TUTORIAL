import { NextResponse } from "next/server";
import User from "../../../../lib/modals/user";
import Category from "@/lib/modals/category";
import connectDB from "@/lib/db";
import { Types } from "mongoose";
import Blog from "@/lib/modals/blog";

export const GET = async (request: Request) => {
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

    const filter: any = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    };

    // TODO

    const blog = await Blog.find(filter);

    return new NextResponse(JSON.stringify({ blog }), { status: 200 });
  } catch (error: any) {
    console.log("Error :", error);
    return new NextResponse("Error getting blog " + error.message, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

    const categoryId = searchParams.get("categoryId");

    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return new NextResponse(
        JSON.stringify({ message: "Title and description are required" }),
        { status: 400 }
      );
    }

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

    // TODO

    const newBlog = new Blog({
      title,
      description,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    });

    await newBlog.save();

    return new NextResponse(
      JSON.stringify({ message: "Blog is created", blog: newBlog }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error :", error);
    return new NextResponse("Error posting blog" + error.message, {
      status: 500,
    });
  }
};
