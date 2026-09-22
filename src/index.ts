/**
 * Standalone Bun HTTP Server serving Solana Action Blink endpoints.
 */

import { CookieActionsHandler } from "./actions.ts";

const handler = new CookieActionsHandler();
const PORT = Number(process.env.PORT || 3000);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Encoding, Accept-Encoding",
};

export default {
  port: PORT,
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // Health check endpoint
    if (url.pathname === "/" || url.pathname === "/health") {
      return new Response(JSON.stringify({ status: "OK", service: "Cookie Chain Solana cApp" }), {
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    // Solana Actions specification endpoint
    if (url.pathname === "/api/actions/cookie-rebalance") {
      if (req.method === "GET") {
        const metadata = handler.getMetadata();
        return new Response(JSON.stringify(metadata), {
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }

      if (req.method === "POST") {
        try {
          const body: any = await req.json().catch(() => ({}));
          const account = body.account;
          const amount = Number(url.searchParams.get("amount") || 0.1);

          const res = handler.handlePostRequest(account, amount);
          return new Response(JSON.stringify(res), {
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 400,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
          });
        }
      }
    }

    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  },
};
