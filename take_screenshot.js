import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

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

  if (!executablePath) {
    console.error("Google Chrome executable not found!");
    process.exit(1);
  }

  console.log("Launching Chrome from:", executablePath);
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  // Disable Cache
  await page.setCacheEnabled(false);

  // Log page console errors
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  console.log("Navigating to login page at http://localhost:5176/login");
  await page.goto('http://localhost:5176/login', { waitUntil: 'networkidle2' });

  // Force page reload just in case
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  const artifactDir = 'C:/Users/akhil/.gemini/antigravity/brain/a43cdf89-c477-4bc6-ba3c-2745b4a602cc';
  
  // Take screenshot of Login page
  const loginPath = path.join(artifactDir, 'login_screenshot.png');
  console.log("Saving login screenshot to:", loginPath);
  await page.screenshot({ path: loginPath });

  // Click on "Quick Login - Rajesh (Individual)"
  console.log("Looking for Rajesh Quick Login button...");
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
    console.log("Found button. Clicking...");
    await rajeshBtn.click();
    console.log("Waiting for navigation to dashboard...");
    await new Promise(r => setTimeout(r, 3000));

    const dashboardPath = path.join(artifactDir, 'dashboard_screenshot.png');
    console.log("Saving dashboard screenshot to:", dashboardPath);
    await page.screenshot({ path: dashboardPath });
  } else {
    console.error("Rajesh button not found!");
  }

  await browser.close();
  console.log("Automation process complete!");
}

run().catch(console.error);
