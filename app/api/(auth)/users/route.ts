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
