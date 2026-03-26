import { dbConnect } from "@/config/db";
import { Faq, FaqCategory } from "@/models/Faq";
import { NextResponse } from "next/server";
import { checkRole } from "@/lib/rbac";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const filter: Record<string, unknown> = { isPublished: true };
    if (category) filter.category = category;

    const [faqs, categories] = await Promise.all([
      Faq.find(filter).sort({ category: 1, order: 1 }),
      FaqCategory.find().sort({ order: 1 }),
    ]);

    const groupedFaqs = categories.map((cat) => ({
      category: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      description: cat.description,
      faqs: faqs.filter((f) => f.category === cat.name),
    }));

    const uncategorized = faqs.filter((f) => {
      const catExists = categories.some((c) => c.name === f.category);
      return !catExists;
    });
    if (uncategorized.length > 0) {
      groupedFaqs.push({
        category: "General",
        slug: "general",
        icon: "HelpCircle",
        description: "General questions",
        faqs: uncategorized,
      });
    }

    return NextResponse.json({ success: true, data: groupedFaqs });
  } catch (error) {
    console.error("FAQ GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { authorized, response } = await checkRole(["admin"]);
    if (!authorized) return response as NextResponse;

    const body = await request.json();
    const { question, answer, category, order = 0 } = body;

    if (!question || !answer || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const faq = await Faq.create({ question, answer, category, order });

    return NextResponse.json({ success: true, faq });
  } catch (error) {
    console.error("FAQ POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
