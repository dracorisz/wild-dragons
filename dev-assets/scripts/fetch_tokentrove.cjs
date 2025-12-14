/**
 * Scraper (CommonJS, improved)
 *
 * Usage:
 * 1) npm install node-fetch@2 cheerio fs-extra
 * 2) node scripts/fetch_tokentrove.cjs
 *
 * Notes:
 * - This version avoids p-limit (ESM issues) and tries multiple discovery strategies:
 *   anchors, script/text regex, sitemap.xml and sitemap_index.xml.
 * - If the site is heavily client-rendered you may need a headless browser (Puppeteer).
 * - Check robots.txt / site terms before scraping.
 */
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const { URL } = require('url');

const BASE = 'https://tokentrove.com';
const OUT_COLLECTIONS = 'c:\\Apache24\\htdocs\\wild-dragons\\data\\collections.json';
const OUT_ITEMS = 'c:\\Apache24\\htdocs\\wild-dragons\\data\\items.json';

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'token-scraper/1.0 (+https://example.com)' } });
  if (!res.ok) {
    throw new Error(`Failed ${url}: ${res.status}`);
  }
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
  let id = Number(base) || Math.floor(Date.now() % 1000000);
  while (existingIds.has(id)) id++;
  existingIds.add(id);
  return id;
}

async function discoverCollectionLinks() {
  const links = new Set();

  try {
    const home = await fetchText(BASE);
    const $ = cheerio.load(home);

    // anchors with '/collection/' in href
    $('a[href]').each((i, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      if (href.includes('/collection/')) {
        try { links.add(new URL(href, BASE).href); } catch {}
      }
    });

    // look for URLs in inline scripts or HTML text matching /collection/...
    const textMatches = home.match(/https?:\/\/[^"'\s>]*\/collection\/[^\s"']+/gi) || [];
    textMatches.forEach(u => {
      try { links.add(new URL(u, BASE).href); } catch {}
    });

    // look for relative /collection/... occurrences
    const relMatches = home.match(/\/collection\/[a-zA-Z0-9\-\_\/]+/gi) || [];
    relMatches.forEach(path => {
      try { links.add(new URL(path, BASE).href); } catch {}
    });

    // attempt sitemap.xml and sitemap_index.xml
    const sitemapUrls = [BASE + '/sitemap.xml', BASE + '/sitemap_index.xml'];
    for (const sUrl of sitemapUrls) {
      try {
        const sText = await fetchText(sUrl);
        const locMatches = sText.match(/<loc>([^<]+)<\/loc>/gi) || [];
        locMatches.forEach(m => {
          const u = m.replace(/<\/?loc>/gi, '');
          if (u && u.includes('/collection/')) {
            try { links.add(new URL(u).href); } catch {}
          }
        });
      } catch (err) {
        // ignore sitemap fetch errors
      }
    }

  } catch (err) {
    console.error('Failed to fetch homepage for discovery:', err.message);
  }

  return Array.from(links);
}

async function processCollection(link, collectionIdStart, existingItemIds) {
  try {
    const html = await fetchText(link);
    const $ = cheerio.load(html);

    const metaTitle = $('meta[property="og:title"]').attr('content') || $('title').text() || slugFromUrl(link);
    const metaDesc = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
    const metaImage = $('meta[property="og:image"]').attr('content') || $('img').first().attr('src') || '';

    const slug = slugFromUrl(link) || (`collection-${collectionIdStart}`);
    const collImage = metaImage ? (new URL(metaImage, BASE)).href : '';

    const coll = {
      id: collectionIdStart,
      title: (metaTitle || slug).trim(),
      slug: slug,
      desc: metaDesc ? metaDesc.trim() : '',
      image: collImage
    };

    // find item image URLs: try to extract /img/collections/ patterns
    const itemImgRegexGlobal = /https?:\/\/[^"'\s>]+\/img\/collections\/[^"'\s>]+/g;
    let matches = (html.match(itemImgRegexGlobal) || []);

    // also look for relative patterns
    const relMatches = (html.match(/\/img\/collections\/[^\s"'<>]+/gi) || []).map(p => new URL(p, BASE).href);
    matches = matches.concat(relMatches);

    // fallback: try to find data attributes or JSON-LD containing image URLs
    $('script[type="application/ld+json"]').each((i, el) => {
      try {
        const json = JSON.parse($(el).text());
        const jsonStr = JSON.stringify(json);
        const jm = jsonStr.match(/https?:\/\/[^"'\s>]+\/img\/collections\/[^"'\s>]+/gi) || [];
        matches = matches.concat(jm);
      } catch {}
    });

    // dedupe and prefer images that include the slug
    const uniqueImgs = Array.from(new Set(matches.map(u => {
      try { return new URL(u, BASE).href; } catch { return null; }
    }).filter(Boolean)));

    // prefer those matching slug
    let preferred = uniqueImgs.filter(u => u.toLowerCase().includes(`/${slug.toLowerCase()}/`));
    if (preferred.length === 0) preferred = uniqueImgs;

    // limit to reasonable number
    const imagesToUse = preferred.slice(0, 12);

    const items = imagesToUse.map((imgUrl, idx) => {
      const m = imgUrl.match(/\/(\d+)(?:\.[a-zA-Z]{2,4})$/);
      const baseId = m ? m[1] : `${slug}-${idx+1}`;
      const id = ensureId(baseId, existingItemIds);
      const title = `${coll.title} #${m ? m[1] : idx+1}`;
      return {
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
    });

    return { coll, items };
  } catch (err) {
    console.error('Error processing', link, err.message);
    return null;
  }
}

async function main() {
  console.log('Starting tokentrove scraper (local). Confirm scraping is allowed for this site.');

  const colLinks = await discoverCollectionLinks();
  console.log(`Discovered ${colLinks.length} collection links.`);

  const collections = [];
  const items = [];
  const existingItemIds = new Set();
  let cid = 1;

  if (colLinks.length === 0) {
    console.warn('No collection links discovered. The site may be client-rendered. Consider using Puppeteer for dynamic content.');
  }

  // process sequentially
  for (const link of colLinks) {
    const result = await processCollection(link, cid, existingItemIds);
    if (result && result.coll) {
      collections.push(result.coll);
      result.items.forEach(it => items.push(it));
      cid++;
      console.log(`Added collection: ${result.coll.title} (${result.items.length} items)`);
    }
  }

  // write JSON files (safe even if empty)
  try {
    await fs.outputJson(OUT_COLLECTIONS, collections, { spaces: 2 });
    await fs.outputJson(OUT_ITEMS, items, { spaces: 2 });
    console.log(`Wrote ${collections.length} collections to ${OUT_COLLECTIONS}`);
    console.log(`Wrote ${items.length} items to ${OUT_ITEMS}`);
  } catch (err) {
    console.error('Failed to write output files:', err.message);
  }

  console.log('Done.');
}

main().catch(err => {
  console.error('Fatal error', err);
  process.exit(1);
});
