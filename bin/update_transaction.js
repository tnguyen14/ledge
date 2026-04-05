#!/usr/bin/env node

import 'dotenv/config';
import { program } from 'commander';
import simpleFetch from 'simple-fetch';
import { getToken } from '@tridnguyen/auth/server.js';

program
  .argument('<id>', 'transaction ID to update')
  .option('--category <category>', 'category to assign')
  .option('--dry-run');
program.parse();

const [id] = program.args;
const options = program.opts();

const updates = {};
if (options.category) updates.category = options.category;
if (!Object.keys(updates).length) {
  throw new Error('No fields to update — provide --category');
}

const token = await getToken({
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  audience: 'https://lists.cloud.tridnguyen.com'
});

const { patchJson } = simpleFetch;

const LISTS_URLS = {
  dev: 'http://localhost:13050',
  prod: 'https://lists.cloud.tridnguyen.com'
};

const env = process.env.env;

if (options.dryRun) {
  console.log(`Would update ${id}:`, updates);
} else {
  await patchJson(`${LISTS_URLS[env]}/ledge/tri/items/${id}`, updates, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  console.log(`Updated ${id}`);
}
