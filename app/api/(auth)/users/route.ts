import { NextResponse } from "next/server";
import User from "../../../../lib/modals/user";
import connectDB from "@/lib/db";
import { Types } from "mongoose";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export const GET = async () => {
  try {
    await connectDB();

    const users = await User.find();

    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error fetching the user data" + error.message, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    await connectDB();

    const newUser = new User(body);

    await newUser.save();

    return new NextResponse(
      JSON.stringify({ message: "User is created", user: newUser }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error :", error);
    return new NextResponse("Error in creating user" + error.message, {
      status: 500,
    });
  }
};

export const PUT = async (request: Request) => {
  try {
    const body = await request.json();

    const { userId, newUsername } = body;

    await connectDB();

    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({ message: "ID or new username not found" }),
        {
          status: 400,
        }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid User id" }), {
        status: 400,
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { username: newUsername },
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "User is updated succesfully!",
        user: updatedUser,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error :", error);
    return new NextResponse("Error updating user" + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
  } catch (error: any) {
    console.log("Error :", error);
    return new NextResponse("Error deleting user" + error.message, {
      status: 500,
    });
  }
};
