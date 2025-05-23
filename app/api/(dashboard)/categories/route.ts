import { NextResponse } from "next/server";
import User from "../../../../lib/modals/user";
import Category from "@/lib/modals/category";
import connectDB from "@/lib/db";
import { Types } from "mongoose";

export const GET = async (request: Request) => {
  try {
    // url to get the id  of the user
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId found" }),
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 400,
      });
    }

    const categories = await Category.find({
      user: new Types.ObjectId(userId),
    });

    return new NextResponse(JSON.stringify(categories), {
      status: 200,
    });
  } catch (error: any) {
    console.log("Error :", error);
    return new NextResponse("Error in fetching categories" + error.message, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

    const { title } = await request.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId found" }),
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 400,
      });
    }

    const newCategory = new Category({
      title,
      userId: new Types.ObjectId(userId),
    });

    await newCategory.save();

    return new NextResponse(
      JSON.stringify({
        message: "Category is created successfully",
        category: newCategory,
      }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log("Error :", error);
    return new NextResponse("Error in posting category" + error.message, {
      status: 500,
    });
  }
};
