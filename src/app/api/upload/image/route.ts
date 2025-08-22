import { NextRequest, NextResponse } from 'next/server';
import { put } from "@vercel/blob";

// 禁用默认的 body 解析
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: '没有上传文件' },
        { status: 400 }
      );
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '不支持的文件类型' },
        { status: 400 }
      );
    }

    // 验证文件大小 (最大 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '文件大小不能超过 5MB' },
        { status: 400 }
      );
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${extension}`;

    // 转换为 Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 生产环境：上传到云存储（这里以 Vercel Blob 为例）
    const fileUrl = await uploadToCloudStorage(buffer, fileName, file.type);

    return NextResponse.json({
      success: true,
      message: '文件上传成功',
      data: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileUrl,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('上传错误:', error);
    return NextResponse.json(
      { error: '文件上传失败' },
      { status: 500 }
    );
  }
}

// 上传到云存储（示例函数，需要根据实际云服务商实现）
async function uploadToCloudStorage(buffer: Buffer, fileName: string, contentType: string): Promise<string> {
  const blob = await put(fileName, buffer, {
    access: 'public',
    contentType,
  });
  return blob.url;
}