import { sql } from "@/lib/db";

// Test if the Neon PostgreSQL database connection works
// http://192.168.1.101:3000/api/db-test
export async function GET() {
  const result = await sql`SELECT version()`;

  return Response.json({
    ok: true,
    postgres: result[0],
  });
}
