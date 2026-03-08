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
