import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { MongoServerError } from "mongodb";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getClicks() {
  const db = await getDb();
  const collection = db.collection<{ href: string; count: number }>("clicks");
  await collection.createIndex({ href: 1 }, { unique: true });
  return collection;
}

export async function GET() {
  try {
    const collection = await getClicks();
    const docs = await collection.find({}, {
      projection: { _id: 0, href: 1, count: 1 },
    }).toArray();
    return NextResponse.json({
      counts: Object.fromEntries(docs.map((doc) => [doc.href, doc.count])),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "클릭 수를 조회할 수 없습니다." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "올바른 JSON이 필요합니다." }, { status: 400 });
  }
  const href = body && typeof body === "object" && "href" in body ? body.href : undefined;
  if (typeof href !== "string" || !URL.canParse(href) ||
      !["https:", "http:"].includes(new URL(href).protocol)) {
    return NextResponse.json({ error: "올바른 링크 주소가 필요합니다." }, { status: 400 });
  }
  try {
    const collection = await getClicks();
    let result;
    try {
      result = await collection.findOneAndUpdate(
        { href }, { $inc: { count: 1 } },
        { upsert: true, returnDocument: "after" },
      );
    } catch (error) {
      // Concurrent first clicks may race to create the same counter.
      if (!(error instanceof MongoServerError) || error.code !== 11000) throw error;
      result = await collection.findOneAndUpdate(
        { href }, { $inc: { count: 1 } },
        { returnDocument: "after" },
      );
    }
    if (!result) throw new Error("Click counter was not found");
    return NextResponse.json({ href, count: result.count });
  } catch {
    return NextResponse.json({ error: "클릭 수를 저장할 수 없습니다." }, { status: 503 });
  }
}
