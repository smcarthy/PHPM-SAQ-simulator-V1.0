const { test, expect } = require('@playwright/test');

function parseClock(text) {
  const m = text.match(/(\d{2}):(\d{2}):(\d{2})/);
  if (!m) return null;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
}

async function startFullExam(page) {
  await page.getByRole('button', { name: /start full exam/i }).click();
  await expect(page.locator('#exam')).toBeVisible();
  await expect(page.locator('#question-content h3')).toContainText('Question');
}

async function runCommonFlow(page, expectedMode) {
  await startFullExam(page);

  const firstInput = page.locator('.answer-area input, .answer-area textarea').first();
  await firstInput.fill(`smoke-${expectedMode}`);

  await page.getByRole('button', { name: /flag\/unflag/i }).click();
  await expect(page.locator('#question-list li.active')).toContainText('★');

  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('#question-content h3')).toContainText('Question');
  await page.getByRole('button', { name: 'Previous' }).click();

  const beforeReloadText = await page.locator('#timer').innerText();
  const beforeReload = parseClock(beforeReloadText);
  await page.reload();
  await expect(page.locator('#exam')).toBeVisible();
  const afterReloadText = await page.locator('#timer').innerText();
  const afterReload = parseClock(afterReloadText);
  expect(afterReload).not.toBeNull();
  if (beforeReload !== null && afterReload !== null) {
    expect(afterReload).toBeLessThanOrEqual(beforeReload);
  }

  await page.locator('#calculator-icon').click();
  await page.locator('#calculator-panel .calc-btn[data-val="1"]').first().click();
  await page.locator('#calculator-panel .calc-btn[data-val="+"]').click();
  await page.locator('#calculator-panel .calc-btn[data-val="1"]').first().click();
  await page.locator('#calculator-panel .calc-btn[data-val="="]').click();
  await expect(page.locator('#calc-display')).toHaveValue('2');

  await page.getByRole('button', { name: /review\/submit/i }).click();
  await expect(page.locator('#review')).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept());
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /submit exam/i }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).toBeTruthy();

  const downloadStream = await download.createReadStream();
  let body = '';
  for await (const chunk of downloadStream) {
    body += chunk.toString();
  }
  const payload = JSON.parse(body);
  expect(payload.exam_mode).toBe('full');
  expect(payload.data_mode).toBe(expectedMode);
  expect(Array.isArray(payload.questions)).toBeTruthy();
}


test('applied exam start practising cards render updated descriptions without overlap', async ({ page }) => {
  await page.goto('/applied-exam.html');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Public Health & Preventive Medicine Applied Exam Hub');
  await expect(page.getByRole('link', { name: 'Applied Exam Hub' })).toHaveAttribute('aria-current', 'page');

  const subtabs = page.locator('.applied-subtab');
  await expect(subtabs).toHaveCount(6);
  await expect(subtabs.nth(2)).toContainText('Build a Station');
  await expect(subtabs.nth(4)).toContainText('Hot Topics');
  await expect(subtabs.nth(5)).toContainText('Study Planner');

  const iconBackgrounds = await page.locator('.applied-subtab-icon').evaluateAll((icons) => icons.map((icon) => getComputedStyle(icon).backgroundImage));
  for (const backgroundImage of iconBackgrounds) {
    expect(backgroundImage).toContain('assets/applied/');
  }

  const bannerBox = await page.locator('.site-header .applied-subtabs').boundingBox();
  const homeBox = await page.locator('#applied-home').boundingBox();
  expect(bannerBox).not.toBeNull();
  expect(homeBox).not.toBeNull();
  expect(bannerBox.y).toBeLessThan(homeBox.y);

  await page.getByRole('tab', { name: /start practising/i }).click();

  const cards = page.locator('.gpt-launcher-card');
  await expect(cards).toHaveCount(9);
  await expect(cards.nth(0)).toContainText('For PGY-5 ready to challenge the exam.');
  await expect(cards.nth(1)).toContainText('For PGY-3/4/5 who are currently on their Health Promotion block');
  await expect(cards.nth(7)).toContainText('incidence management systems structure');

  const iconBoxes = await page.locator('.gpt-launcher-icon').evaluateAll((icons) => icons.map((icon) => {
    const iconRect = icon.getBoundingClientRect();
    const cardRect = icon.closest('.gpt-launcher-card').getBoundingClientRect();
    return {
      leftGap: iconRect.left - cardRect.left,
      rightGap: cardRect.right - iconRect.right,
      topGap: iconRect.top - cardRect.top
    };
  }));

  for (const box of iconBoxes) {
    expect(Math.abs(box.leftGap - box.rightGap)).toBeLessThan(24);
    expect(box.topGap).toBeGreaterThan(12);
  }

  const copyAlignment = await page.locator('.gpt-launcher-card').evaluateAll((nodes) => nodes.map((node) => {
    const title = node.querySelector('.gpt-launcher-title').getBoundingClientRect();
    const desc = node.querySelector('.gpt-launcher-descriptor').getBoundingClientRect();
    const cta = node.querySelector('.gpt-launcher-cta').getBoundingClientRect();
    const rect = node.getBoundingClientRect();
    const center = rect.left + (rect.width / 2);
    const midpoint = (title.left + title.right) / 2;
    const descMidpoint = (desc.left + desc.right) / 2;
    const ctaMidpoint = (cta.left + cta.right) / 2;
    return {
      titleOffset: Math.abs(midpoint - center),
      descOffset: Math.abs(descMidpoint - center),
      ctaOffset: Math.abs(ctaMidpoint - center)
    };
  }));

  for (const alignment of copyAlignment) {
    expect(alignment.titleOffset).toBeLessThan(18);
    expect(alignment.descOffset).toBeLessThan(18);
    expect(alignment.ctaOffset).toBeLessThan(18);
  }

  const cardBoxes = await cards.evaluateAll((nodes) => nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
  }));

  for (let i = 0; i < cardBoxes.length; i += 1) {
    for (let j = i + 1; j < cardBoxes.length; j += 1) {
      const a = cardBoxes[i];
      const b = cardBoxes[j];
      const overlaps = !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
      expect(overlaps).toBeFalsy();
    }
  }
});

test('written landing banner and intro stay centered with updated title', async ({ page }) => {
  await page.goto('/index.html');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Public Health & Preventive Medicine Written SAQ Simulator');
  await expect(page.getByRole('link', { name: 'Written SAQ Simulator' })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('.landing-intro')).toContainText('This simulator approximates the written short-answer question');

  const introAlignment = await page.locator('.landing-intro').evaluate((node) => {
    const rect = node.getBoundingClientRect();
    const parentRect = node.parentElement.getBoundingClientRect();
    const midpoint = rect.left + (rect.width / 2);
    const parentMidpoint = parentRect.left + (parentRect.width / 2);
    return Math.abs(midpoint - parentMidpoint);
  });

  expect(introAlignment).toBeLessThan(24);
});

test.describe('Deterministic mode smoke flow', () => {
  test('legacy mode load + full flow', async ({ page }) => {
    await page.goto('/index.html');
    await runCommonFlow(page, 'legacy');

    const keys = await page.evaluate(() => Object.keys(localStorage));
    expect(keys.some((key) => key.startsWith('saq_legacy_'))).toBeTruthy();
    expect(keys.some((key) => key.startsWith('saq_pilot_'))).toBeFalsy();
  });

  test('pilot mode load + full flow + storage isolation', async ({ browser }) => {
    const context = await browser.newContext({ acceptDownloads: true });
    const page = await context.newPage();

    // Seed a legacy session in the same browser context.
    await page.goto('/index.html');
    await startFullExam(page);
    await page.locator('.answer-area input, .answer-area textarea').first().fill('legacy-seed');
    await page.waitForTimeout(1_100);
    await page.reload();

    // Pilot mode should not resume legacy state because storage keys are namespaced.
    await page.goto('/index.html?bank=pilot');
    await expect(page.locator('#landing')).toBeVisible();
    await expect(page.locator('#exam')).toHaveClass(/hidden/);

    await runCommonFlow(page, 'pilot');

    const keys = await page.evaluate(() => Object.keys(localStorage));
    expect(keys.some((key) => key.startsWith('saq_legacy_'))).toBeTruthy();
    expect(keys.some((key) => key.startsWith('saq_pilot_'))).toBeTruthy();

    await context.close();
  });
});
