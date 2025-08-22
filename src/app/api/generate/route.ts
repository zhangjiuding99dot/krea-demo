import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { put } from "@vercel/blob";
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const text = formData.get('prompt') as string;
    const assetId = formData.get('id') as string || nanoid(10);
    const textColor = formData.get('textColor') as string || '#000000';
    const fontSize = parseInt(formData.get('fontSize') as string) || 48;
    const position = formData.get('position') as string || 'center';

    if (!imageFile) {
      return NextResponse.json(
        { error: '请上传图片' },
        { status: 400 }
      );
    }

    if (!text) {
      return NextResponse.json(
        { error: '请提供文本内容' },
        { status: 400 }
      );
    }

    // 验证图片类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: '只支持 JPEG、PNG、WebP 格式的图片' },
        { status: 400 }
      );
    }

    // 转换文件为 Buffer
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

    // 使用 Sharp 处理图片
    const processedImageBuffer = await processImageWithSharp(
      imageBuffer,
      text,
      textColor,
      fontSize,
      position
    );

    // 保存处理后的图片（可选）
    const outputPath = await uploadToCloudStorage(processedImageBuffer, assetId, imageFile.type);

    // 返回处理后的图片
    return NextResponse.json({
      success: true,
      message: '文件上传成功',
      data: {
        fileUrl: outputPath,
      },
    });

  } catch (error) {
    console.error('图片处理错误:', error);
    return NextResponse.json(
      { error: '图片处理失败' },
      { status: 500 }
    );
  }
}

async function processImageWithSharp(
  imageBuffer: Buffer,
  text: string,
  textColor: string = '#ffffff',
  fontSize: number = 48,
  position: string = 'center'
): Promise<Buffer> {
  // 获取图片元数据
  const metadata = await sharp(imageBuffer).metadata();
  const width = metadata.width || 800;
  const height = metadata.height || 600;

  // 创建 SVG 文本
  const svgText = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .text {
          font-family: Arial, sans-serif;
          font-size: ${fontSize}px;
          font-weight: bold;
          fill: ${textColor};
          text-anchor: ${getTextAnchor(position)};
          filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.7));
        }
      </style>
      <text x="${getTextX(position, width)}" y="${getTextY(position, height)}" class="text">${escapeXml(text)}</text>
    </svg>
  `;

  const svgBuffer = Buffer.from(svgText);

  // 叠加文本到图片
  return sharp(imageBuffer)
    .composite([{ input: svgBuffer, blend: 'over' }])
    .png()
    .toBuffer();
}

function getTextAnchor(position: string): string {
  switch (position) {
    case 'left': return 'start';
    case 'right': return 'end';
    default: return 'middle';
  }
}

function getTextX(position: string, width: number): number {
  switch (position) {
    case 'left': return 50;
    case 'right': return width - 50;
    default: return width / 2;
  }
}

function getTextY(position: string, height: number): number {
  switch (position) {
    case 'top': return 80;
    case 'bottom': return height - 50;
    default: return height / 2;
  }
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// 上传到云存储（示例函数，需要根据实际云服务商实现）
async function uploadToCloudStorage(buffer: Buffer, fileName: string, contentType: string): Promise<string> {
  const blob = await put(fileName, buffer, {
    access: 'public',
    contentType,
  });
  return blob.url;
}
