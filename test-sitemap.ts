import sitemap from './app/sitemap';

async function testSitemap() {
  console.log('--- Testing EN ---');
  const en = await sitemap({ id: 'en' });
  console.log(en.slice(0, 5).map(p => p.url));

  console.log('--- Testing RU ---');
  const ru = await sitemap({ id: 'ru' });
  console.log(ru.slice(0, 5).map(p => p.url));

  console.log('--- Testing AM ---');
  const am = await sitemap({ id: 'am' });
  console.log(am.slice(0, 5).map(p => p.url));
}

testSitemap();
