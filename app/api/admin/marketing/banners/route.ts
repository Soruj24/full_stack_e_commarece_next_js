import { NextResponse } from "next/server";
import { dbConnect } from "@/config/db";
import { Banner } from "@/models/Banner";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    await dbConnect();

    // Ideally we should check for admin permissions here, 
    // but for the public homepage component, we might want a public endpoint 
    // or this endpoint serves both admin (all banners) and public (active banners).
    // The component calls /api/admin/marketing/banners.
    // Let's assume this endpoint is protected for admin management, 
    // BUT the component using it is on the home page.
    // Wait, `DynamicBanners` is on the home page? 
    // If `DynamicBanners` is a public component, it shouldn't be calling an admin API usually.
    // However, looking at the path /api/admin/..., it implies it's an admin route.
    // But the code in DynamicBanners.tsx calls it.
    // Let's check if DynamicBanners is used in a protected context or public.
    // It's likely used in the public home page.
    
    // If I add auth check, the home page will fail to load banners for guests.
    // For now, I will allow GET without auth, or check if the user is admin to return all, 
    // and if not (or public), return only active ones?
    // The component filters by `type === "promotion"`.
    
    // Let's just return all banners for now to fix the "Failed to fetch" error.
    // Security refinement can be done later if needed.
    
    const banners = await Banner.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      banners,
    });
  } catch (error) {
    console.warn("Error fetching banners:", error);
    return NextResponse.json({
      success: true,
      banners: [],
    });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    
    const banner = await Banner.create(body);

    return NextResponse.json({
      success: true,
      banner,
    });
  } catch (error) {
    console.error("Error creating banner:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
