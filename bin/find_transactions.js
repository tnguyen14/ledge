#!/usr/bin/env node

import 'dotenv/config';
import { program } from 'commander';
import simpleFetch from 'simple-fetch';
import { stringify } from 'qs';
import { getToken } from '@tridnguyen/auth/server.js';

program
  .option('-m, --merchant <merchant>')
  .option('-c, --category <category>')
  .option('--id <id>')
  .option('--date <date>', 'date in MM-DD-YYYY format')
  .option('--limit <number>', 'limit number of results')
  .option('-d, --debug');
program.parse();

const options = program.opts();

const token = await getToken({
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  audience: 'https://lists.cloud.tridnguyen.com'
});

const { getJson } = simpleFetch;

const LISTS_URLS = {
  dev: 'http://localhost:13050',
  prod: 'https://lists.cloud.tridnguyen.com'
};

const env = process.env.env;

if (!options.merchant && !options.category && !options.id && !options.date) {
  throw new Error(
    "Missing option: provide '--merchant', '--category', '--id', or '--date'"
  );
}

if (options.id) {
  getJson(`${LISTS_URLS[env]}/ledge/tri/items/${options.id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(
    (data) => {
      console.log(JSON.stringify(data, null, 2));
    },
    (err) => {
      console.error('Something went wrong');
      console.error(err);
    }
  );
} else {
  const where = [];

  if (options.merchant) {
    where.push({ field: 'merchant', op: '==', value: options.merchant });
  }

  if (options.category) {
    where.push({ field: 'category', op: '==', value: options.category });
  }

  if (options.date) {
    const [month, day, year] = options.date.split('-');
    const start = new Date(year, month - 1, day);
    const end = new Date(year, month - 1, day);
    end.setDate(end.getDate() + 1);
    where.push({ field: 'date', op: '>=', value: start.toISOString() });
    where.push({ field: 'date', op: '<', value: end.toISOString() });
  }

  const query = stringify({ where });

  if (options.debug) {
    console.log(`Query: ${query}`);
  }

  getJson(`${LISTS_URLS[env]}/ledge/tri/items?${query}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(
    (data) => {
      const results = options.limit
        ? data.slice(0, parseInt(options.limit))
        : data;
      console.log(JSON.stringify(results, null, 2));
    },
    (err) => {
      console.error('Something went wrong');
      console.error(err);
    }
  );
}
