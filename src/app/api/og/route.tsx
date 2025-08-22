import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const title = decodeURIComponent(searchParams.get('title') || '精彩内容')
    const subtitle = decodeURIComponent(searchParams.get('subtitle') || '探索更多可能性')
    const id = decodeURIComponent(searchParams.get('id') || '')

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '80px',
            position: 'relative',
          }}
        >
          {/* 背景装饰 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          />

          {/* 内容容器 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >

            {/* 主标题 */}
            <div
              style={{
                fontSize: 76,
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '30px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                maxWidth: '900px',
                lineHeight: 1.2,
              }}
            >
              {title}
            </div>

            {/* 副标题 */}
            <div
              style={{
                fontSize: 36,
                color: 'rgba(255, 255, 255, 0.9)',
                opacity: 0.9,
                maxWidth: '800px',
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* 底部水印 */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              fontSize: 20,
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            {id ? id : ''}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    console.error(e)
    return new Response('Failed to generate image', { status: 500 })
  }
}