import { NextResponse } from "next/server";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import connectDB from "@/lib/db";
import { Types } from "mongoose";

export const PUT = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    // got title from the body
    const body = await request.json();
    const { title } = body;

    // url to get the id  of the user
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // checking if userId is invalid or missing
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId found" }),
        {
          status: 400,
        }
      );
    }

    // checking if categoryId that we used dynamic routing is missing
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
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

    const category = await Category.findOne({ _id: categoryId, user: userId });

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        {
          status: 400,
        }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      { _id: categoryId },
      { title },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        message: "Category is updated",
        category: updatedCategory,
      }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log("Error :", error);
    return new NextResponse("Error updating category" + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (
  request: Request,
  { params }: { params: { category: string } }
) => {
  try {
    // getting the categoryId from the dynamic route
    const categoryId = params.category;

    // getting the userId from the body
    const body = await request.json();
    const { userId } = body;

    if (
      !userId ||
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(categoryId)
    ) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing id" }),
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const category = await Category.findOne({ _id: categoryId, user: userId });

    if (!category) {
      return new NextResponse(
        JSON.stringify({
          message: "Category not found or does not belong to the user",
        }),
        {
          status: 400,
        }
      );
    }

    await Category.findByIdAndDelete(categoryId);

    return new NextResponse(
      JSON.stringify({ message: "Category is deleted" }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log("Error :", error);
    return new NextResponse("Error in deleting the category" + error.message, {
      status: 500,
    });
  }
};
