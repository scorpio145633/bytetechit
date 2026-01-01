/**
 * ByteTech Website - Cloudflare Workers Entry Point
 * 
 * 这个 Worker 用于处理静态网站的请求
 * 静态资源由 wrangler.jsonc 中配置的 assets 目录提供
 */

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // 静态资源由 Cloudflare Workers Assets 自动处理
    // 这个 fetch handler 用于处理任何需要自定义逻辑的请求
    
    const url = new URL(request.url);
    
    // 如果需要，可以在这里添加自定义路由逻辑
    // 例如：API 端点、重定向等
    
    // 默认情况下，让 Assets 处理所有请求
    return new Response('Not Found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;

interface Env {
  // 在这里定义环境变量类型
  // 例如：MY_VAR: string;
}
