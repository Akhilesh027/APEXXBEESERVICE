import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function run() {
  const paths = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Users/akhil/AppData/Local/Google/Chrome/Application/chrome.exe'
  ];
  
  let executablePath = '';
  for (const p of paths) {
    if (fs.existsSync(p)) {
      executablePath = p;
      break;
    }
  }

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setCacheEnabled(false);

  console.log("Navigating to http://localhost:5176/login");
  await page.goto('http://localhost:5176/login', { waitUntil: 'networkidle2' });

  // Get computed styles of Sign In button
  const buttonStyle = await page.evaluate(() => {
    const btn = document.querySelector('button[type="submit"]');
    if (!btn) return null;
    const style = window.getComputedStyle(btn);
    return {
      backgroundColor: style.backgroundColor,
      color: style.color,
      className: btn.className
    };
  });
  console.log("Login Sign In Button Styles:", buttonStyle);

  // Click Rajesh to login
  const buttons = await page.$$('button');
  let rajeshBtn = null;
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Rajesh')) {
      rajeshBtn = btn;
      break;
    }
  }

  if (rajeshBtn) {
    await rajeshBtn.click();
    await new Promise(r => setTimeout(r, 2000));

    // Get computed styles of Dashboard wrapper and View Requests button
    const dashboardStyles = await page.evaluate(() => {
      const body = document.body;
      const bodyStyle = window.getComputedStyle(body);
      const rootDiv = document.querySelector('.min-h-screen');
      const rootDivStyle = rootDiv ? window.getComputedStyle(rootDiv) : null;
      
      const activeNav = document.querySelector('button.bg-brand-600');
      const activeNavStyle = activeNav ? window.getComputedStyle(activeNav) : null;

      const viewRequestsBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('View Requests'));
      const viewRequestsBtnStyle = viewRequestsBtn ? window.getComputedStyle(viewRequestsBtn) : null;

      return {
        bodyBg: bodyStyle.backgroundColor,
        bodyColor: bodyStyle.color,
        rootDivBg: rootDivStyle ? rootDivStyle.backgroundColor : null,
        activeNavBg: activeNavStyle ? activeNavStyle.backgroundColor : null,
        viewRequestsBtnBg: viewRequestsBtnStyle ? viewRequestsBtnStyle.backgroundColor : null
      };
    });
    console.log("Dashboard Computed Styles:", dashboardStyles);
  }

  await browser.close();
}

run().catch(console.error);
