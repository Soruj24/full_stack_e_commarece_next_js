import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { dbConnect } = await import("@/config/db");
    const mongoose = (await import("mongoose")).default;
    const os = await import("os");
    const { redis } = await import("@/lib/redis");

    await dbConnect();

    // Database status
    const dbStatus = mongoose.connection.readyState === 1 ? "Healthy" : "Unhealthy";

    // Redis status
    let redisStatus = "Disconnected";
    try {
      if (redis) {
        const ping = await redis.ping();
        if (ping === "PONG") redisStatus = "Healthy";
      }
    } catch (error) {
      console.error("Redis health check failed:", error);
    }

    // Server Info
    const systemInfo = {
      platform: os.platform(),
      cpuUsage: (os.loadavg()[0] * 10).toFixed(2) + "%",
      totalMemory: (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2) + " GB",
      freeMemory: (os.freemem() / (1024 * 1024 * 1024)).toFixed(2) + " GB",
      uptime: (os.uptime() / 3600).toFixed(2) + " hours",
    };

    return NextResponse.json({
      success: true,
      health: {
        database: dbStatus,
        redis: redisStatus,
        system: systemInfo,
      },
    });
  } catch (error: unknown) {
    console.error("System health check error:", error);
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
