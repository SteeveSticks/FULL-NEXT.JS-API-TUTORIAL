import { NextResponse } from "next/server";
import User from "../../../../lib/modals/user";
import Category from "@/lib/modals/category";
import connectDB from "@/lib/db";
import { Types } from "mongoose";
import Blog from "@/lib/modals/blog";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    // getting userId from the searchParams
    const userId = searchParams.get("userId");
    // getting categoryId from the searchParams
    const categoryId = searchParams.get("categoryId");
    // filtering by search
    const searchkeywords = searchParams.get("keyword") as string;

    // for startdate and enddate like the one they use for the forms, scholl start date end date, this is who they pull it out
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

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

    if (searchkeywords) {
      filter.$or = [
        { title: { $regex: searchkeywords, $options: "i" } },
        { description: { $regex: searchkeywords, $options: "i" } },
      ];
    }

    if (startDate && endDate) {
      filter.createdAt = {
        // opsosite of each other prefect for startDate and endDate: [startDate is when the specified filed is greater than or equals to the provided value], [endDate is the opposite when the specified field | value of the field, the field is less down or eqaul to the value specifed value]
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      filter.createdAt = {
        $lte: new Date(endDate),
      };
    }

    const skip = (page - 1) * limit;

    // to use acending and descending order we want to filter by sort ("asc -> ascending")
    const blog = await Blog.find(filter)
      .sort({ createdAt: "asc" })
      .skip(skip)
      .limit(limit);

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
