import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // In production: query database
  // const video = await prisma.video.findUnique({ where: { id } });

  return NextResponse.json({
    id,
    message: "Video-Detail API — verbinde mit Datenbank für echte Daten",
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // In production: delete from database + storage
  // await prisma.video.delete({ where: { id } });
  // await supabase.storage.from('videos').remove([`${id}.mp4`]);

  return NextResponse.json({ deleted: true, id });
}
