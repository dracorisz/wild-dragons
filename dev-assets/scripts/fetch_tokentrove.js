/**
 * Scraper: fetch_tokentrove.js
 *
 * Usage:
 * 1) npm install node-fetch@2 cheerio fs-extra p-limit
 * 2) node scripts/fetch_tokentrove.js
 *
 * Notes:
 * - Check https://tokentrove.com/robots.txt and site terms before scraping.
 * - The script uses generic selectors and regexes; you may need to adjust selectors if the site's HTML differs.
 * - This script will overwrite data/collections.json and data/items.json in the repo.
 */
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const pLimit = require('p-limit');
const { URL } = require('url');

const BASE = 'https://tokentrove.com';
const OUT_COLLECTIONS = 'c:\\Apache24\\htdocs\\wild-dragons\\data\\collections.json';
const OUT_ITEMS = 'c:\\Apache24\\htdocs\\wild-dragons\\data\\items.json';

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'token-scraper/1.0 (+https://example.com)' } });
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  return res.text();
}

function slugFromUrl(url) {
  try {
    const u = new URL(url, BASE);
    const segs = u.pathname.split('/').filter(Boolean);
    return segs[segs.length - 1] || segs[segs.length - 2] || '';
  } catch {
    return '';
  }
}

function ensureId(base, existingIds) {
  let id = Number(base) || Date.now() % 1000000;
  while (existingIds.has(id)) id++;
  existingIds.add(id);
  return id;
}

async function main() {
  console.log('Starting tokentrove scraper (local).');
  console.log('Make sure scraping is allowed for this site.');

  const homepage = await fetchText(BASE);
  const $home = cheerio.load(homepage);

  // discover collection links by href containing '/collection/'
  const colLinks = new Set();
  $home('a[href]').each((i, el) => {
    const href = $home(el).attr('href');
    if (!href) return;
    if (href.includes('/collection/')) {
      const full = new URL(href, BASE).href;
      colLinks.add(full);
    }
  });

  // fallback: find any link that looks like /collection/...
  if (colLinks.size === 0) {
    const matches = homepage.match(/href="([^"]*\/collection\/[^"]*)/g) || [];
    matches.forEach(m => {
      const href = m.replace(/^href="/, '');
      colLinks.add(new URL(href, BASE).href);
    });
  }

  console.log(`Found ${colLinks.size} collection links.`);

  const collections = [];
  const items = [];
  const existingItemIds = new Set();
  let collectionId = 1;

  const limit = pLimit(5); // concurrency

  const tasks = Array.from(colLinks).map(link => limit(async () => {
    try {
      const html = await fetchText(link);
      const $ = cheerio.load(html);

      // prefer meta og:title / og:description / og:image
      const metaTitle = $('meta[property="og:title"]').attr('content') || $('title').text() || slugFromUrl(link);
      const metaDesc = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
      const metaImage = $('meta[property="og:image"]').attr('content') || $('img').first().attr('src') || '';

      const slug = slugFromUrl(link) || (`collection-${collectionId}`);
      const collImage = metaImage ? (new URL(metaImage, BASE)).href : '';

      const coll = {
        id: collectionId,
        title: (metaTitle || slug).trim(),
        slug: slug,
        desc: metaDesc ? metaDesc.trim() : '',
        image: collImage
      };
      collections.push(coll);
      collectionId++;

      // find item image URLs: try to extract /img/collections/<slug>/<id>.* or any /img/collections/ occurrences
      const itemImgRegexGlobal = /https?:\/\/[^"'\s>]+\/img\/collections\/[^"'\s>]+/g;
      const matches = (html.match(itemImgRegexGlobal) || []);
      const collectionImgs = matches
        .map(u => {
          try { return new URL(u, BASE).href; } catch { return null; }
        })
        .filter(Boolean)
        .filter(u => u.includes(`/${slug}/`) || u.toLowerCase().includes(slug.toLowerCase()))
      ;

      // fallback: collect any /img/collections/ images on the site and attribute to this collection if none found
      if (collectionImgs.length === 0) {
        const fallbackMatches = (html.match(itemImgRegexGlobal) || []).map(u => new URL(u, BASE).href);
        collectionImgs.push(...fallbackMatches.slice(0, 6));
      }

      // deduplicate
      const uniqueImgs = Array.from(new Set(collectionImgs)).slice(0, 12);

      uniqueImgs.forEach((imgUrl, idx) => {
        // try to extract numeric id from filename
        const m = imgUrl.match(/\/(\d+)(?:\.[a-zA-Z]{2,4})$/);
        const baseId = m ? m[1] : `${coll.slug}-${idx+1}`;
        const id = ensureId(baseId, existingItemIds);
        const title = `${coll.title} #${m ? m[1] : idx+1}`;
        const it = {
          id: id,
          collection_slug: coll.slug,
          title: title,
          desc: coll.desc || `${coll.title} item ${idx+1}`,
          image: imgUrl,
          paymentOptions: [
            { currency: "USDC", price: (Math.random()*20+1).toFixed(2), icon: "https://placehold.co/24x24?text=USDC" },
            { currency: "IMX", price: (Math.random()*2+0.1).toFixed(3), icon: "https://placehold.co/24x24?text=IMX" },
            { currency: "RON", price: (Math.random()*100+10).toFixed(2), icon: "https://placehold.co/24x24?text=RON" }
          ]
        };
        items.push(it);
      });

      console.log(`Processed collection: ${coll.title} (items: ${uniqueImgs.length})`);
    } catch (err) {
      console.error('Error processing', link, err.message);
    }
  }));

  await Promise.all(tasks);

  // write JSON files
  await fs.outputJson(OUT_COLLECTIONS, collections, { spaces: 2 });
  await fs.outputJson(OUT_ITEMS, items, { spaces: 2 });

  console.log(`Wrote ${collections.length} collections to ${OUT_COLLECTIONS}`);
  console.log(`Wrote ${items.length} items to ${OUT_ITEMS}`);
  console.log('Done.');
}

main().catch(err => {
  console.error('Fatal error', err);
  process.exit(1);
});
