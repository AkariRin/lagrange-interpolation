import Interpolation from '../src/interpolation.js';

export function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // 解析请求体
    const contentType = context.request.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      return context.request.json().then(data => {
        return handleInterpolation(data);
      });
    } else {
      return new Response(JSON.stringify({ error: 'Content-Type must be application/json' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request body', details: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function handleInterpolation(data) {
  try {
    // 验证输入数据
    if (!Array.isArray(data.points)) {
      return new Response(JSON.stringify({ error: 'Points must be an array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 创建插值对象
    const interpolation = new Interpolation(data.points);

    // 验证数据
    if (!interpolation.validate()) {
      return new Response(
        JSON.stringify({
          error: 'Invalid data: check for duplicate keys or non-finite numbers'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(JSON.stringify({
      success: true,
      latex: interpolation.createLatex()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Server error',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
