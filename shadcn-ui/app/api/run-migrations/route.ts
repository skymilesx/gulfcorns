export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { promisify } from 'node:util';
import { exec } from 'node:child_process';
const execAsync = promisify(exec);

export async function GET(req: Request) {
  const token = req.headers.get('x-migrate-token');
  if (process.env.MIGRATION_TOKEN && token !== process.env.MIGRATION_TOKEN) {
    return new Response('Unauthorized', { status: 401 });
  }
  try {
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy');
    if (stderr) console.error(stderr);
    return new Response(stdout || 'Migrations applied', { status: 200 });
  } catch (e: any) {
    return new Response(e?.stderr || e?.message || 'Migration failed', { status: 500 });
  }
}
