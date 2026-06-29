import { NextResponse } from "next/server";
import { db } from "@/db";
import { beers, beerImages } from "@/db/schema";
import { resizeImage, uploadToCloudinary } from "@/lib/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const rawData = formData.get("data");
    const file = formData.get("file");

    if (!rawData || typeof rawData !== "string") {
      return NextResponse.json({ error: "Missing beer data" }, { status: 400 });
    }

    const data = JSON.parse(rawData);

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing image file" },
        { status: 400 },
      );
    }

    // 1. Create beer
    const [beer] = await db
      .insert(beers)
      .values({
        name: data.name,
        countryId: data.country.id,
        breweryId: data.brewery.id,
        styleId: data.style?.id ?? null,
        volumeMl: data.volumeMl,

        abv: data.abv,
        ibu: data.ibu,
        ebu: data.ebu,
        ebc: data.ebc,
        eanBarcode: data.eanBarcode || null,

        createdByUserId: session.user.id,
      })
      .returning();

    // 2. Process image
    const buffer = Buffer.from(await file.arrayBuffer());
    const resized = await resizeImage(buffer);

    // 3. Upload to Cloudinary
    const upload = await uploadToCloudinary(resized);

    // 4. Save image in DB
    await db.insert(beerImages).values({
      beerId: beer.id,
      imageUrl: upload.secure_url,
      cloudinaryPublicId: upload.public_id,
      fileName: file.name,
      mimeType: file.type,
      uploadedByUserId: session.user.id,
    });

    return NextResponse.json({
      success: true,
      beerId: beer.id,
      imageUrl: upload.secure_url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to create beer",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
