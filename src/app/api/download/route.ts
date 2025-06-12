import { NextRequest } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

export async function GET(request: NextRequest) {
  
  try {
    const url = new URL(request.url);
    const filePath = url.searchParams.get('path');

    if (!filePath) {
      console.log('[API] 파일 경로 누락 오류');
      return new Response(JSON.stringify({ error: '파일 경로가 제공되지 않았습니다.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const fullPath = path.join(process.cwd(), 'public', filePath);
    
    if (!fullPath.startsWith(path.join(process.cwd(), 'public'))) {
      return new Response(JSON.stringify({ error: '잘못된 파일 경로입니다.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    try {
      if (!fs.existsSync(fullPath)) {
        return new Response(JSON.stringify({ error: '파일을 찾을 수 없습니다.' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (existsError) {
      console.error( existsError);
      return new Response(JSON.stringify({ error: '파일 확인 중 오류가 발생했습니다.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let fileStats;
    try {
      fileStats = fs.statSync(fullPath);
      console.log( fileStats.size);
    } catch (statsError) {
      console.error( statsError);
      return new Response(JSON.stringify({ error: '파일 정보를 가져올 수 없습니다.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const fileName = path.basename(fullPath);
    
    const ext = path.extname(fileName).toLowerCase();
    let contentType = 'application/octet-stream'; 
    
    if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (ext === '.hwp') {
      contentType = 'application/x-hwp';
    }
    
    let fileBuffer;
    try {
      fileBuffer = fs.readFileSync(fullPath);
    } catch (readError) {
      console.error( readError);
      return new Response(JSON.stringify({ error: '파일을 읽을 수 없습니다.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    headers.set('Content-Length', fileStats.size.toString());
    
    return new Response(fileBuffer, {
      status: 200,
      headers
    });
    
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ 
      error: '파일 다운로드 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 