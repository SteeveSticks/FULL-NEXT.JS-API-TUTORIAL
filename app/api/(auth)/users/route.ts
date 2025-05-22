import { NextResponse } from "next/server";
import User from "../../../../lib/modals/user";
import connectDB from "@/lib/db";

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
