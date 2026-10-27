import { onRequest } from '../functions/api.js';

/**
 * Workers 入口：把 Request 适配成 Pages Functions 的 context 形状。
 * 原 onRequest 只用到 context.request，其余字段保持结构完整以便后续扩展。
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 静态资源由 assets 直接托管，只有 /api 进入 Worker 处理逻辑
    if (url.pathname === '/api') {
      return onRequest({
        request,
        env,
        params: {},
        data: {},
        next: () => Promise.resolve(new Response(null, { status: 404 })),
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};
