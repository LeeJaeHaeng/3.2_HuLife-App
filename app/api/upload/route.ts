import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { randomUUID } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다" }, { status: 400 })
    }

    // 파일 확장자 확인
    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"]
    const fileExtension = file.name.split(".").pop()?.toLowerCase()

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return NextResponse.json({ error: "지원하지 않는 파일 형식입니다" }, { status: 400 })
    }

    // 파일 크기 확인 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "파일 크기는 5MB를 초과할 수 없습니다" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 고유한 파일명 생성
    const fileName = `${randomUUID()}.${fileExtension}`
    const uploadDir = join(process.cwd(), "public", "uploads", "profiles")

    // uploads/profiles 디렉토리 생성 (없는 경우)
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // 디렉토리가 이미 존재하는 경우 무시
    }

    const filePath = join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    // 웹 경로 반환
    const webPath = `/uploads/profiles/${fileName}`

    return NextResponse.json({ url: webPath }, { status: 200 })
  } catch (error) {
    console.error("파일 업로드 오류:", error)
    return NextResponse.json({ error: "파일 업로드에 실패했습니다" }, { status: 500 })
  }
}
