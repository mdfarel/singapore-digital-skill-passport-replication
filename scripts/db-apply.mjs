// Applies schema + seeds to the local or remote D1 database.
//   node scripts/db-apply.mjs local     (default)
//   node scripts/db-apply.mjs remote
import { execFileSync } from 'node:child_process';

const target = process.argv[2] === 'remote' ? '--remote' : '--local';
const files = [
  'db/migrations/0001_init.sql',
  'db/seed.sql',
  'db/seed_lm.sql',
  'db/seed_people.sql',
];
for (const file of files) {
  process.stdout.write(`applying ${file} ... `);
  execFileSync('npx', ['wrangler', 'd1', 'execute', 'skill-passport', target, '--file', file, '-y'],
    { stdio: ['ignore', 'ignore', 'inherit'] });
  console.log('ok');
}
console.log('database ready');
