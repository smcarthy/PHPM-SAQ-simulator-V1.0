const { test, expect } = require('@playwright/test');

const EXPECTED_ASSISTANT_URLS = {
  'gpt-1': 'app://plugins_6ade8858bf2c8191ae509ca267a74b96',
  'gpt-2': 'app://plugin_a54c973540ec819196cd56b1a1ebb2eb',
  'gpt-3': 'https://chatgpt.com/g/g-CP2Ch11qQ-3-communicable-diseases-in-health-protection',
  'gpt-4': 'https://chatgpt.com/g/g-69115c1954708191b542275310c4787c-4-e-oh-built-environment-and-injuries',
  'gpt-5': 'app://plugin_88102ac800f081919fca35400fddc2cc',
  'gpt-6': 'app://plugin_7343b40173348191aa1667b43aa26573',
  'gpt-7': 'app://plugin_7ed326d02d588191806d8b8727ca49c8',
  'gpt-8': 'app://plugins_6ade809c0c188191ad97d438ad37b1b8',
  'gpt-9': 'app://plugins_6ade840a0ab88191bdb0ffbee341e1f7'
};

function parseClock(text) {
  const m = text.match(/(\d{2}):(\d{2}):(\d{2})/);
  if (!m) return null;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
}

async function startFullExam(page) {
  await page.locator('#start-full').click();
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

  // The runtime persists its initial timer value on the first one-second tick.
  await page.waitForTimeout(1_100);
  const beforeReloadText = await page.locator('#timer').innerText();
  const beforeReload = parseClock(beforeReloadText);
  await page.reload();
  await expect(page.locator('#landing')).toBeVisible();
  await expect(page.locator('#resume-option')).toBeVisible();
  await page.locator('#resume-exam').click();
  await expect(page.locator('#exam')).toBeVisible();
  const afterReloadText = await page.locator('#timer').innerText();
  const afterReload = parseClock(afterReloadText);
  expect(afterReload).not.toBeNull();
  if (beforeReload !== null && afterReload !== null) {
    expect(afterReload).toBeLessThanOrEqual(beforeReload);
  }

  const calculatorPanel = page.locator('#calculator-panel');
  if (!(await calculatorPanel.isVisible())) {
    // Dispatch directly so Playwright's synthetic mouse move does not trigger
    // the hover-open handler immediately before the touch-style click toggle.
    await page.locator('#calculator-icon').dispatchEvent('click');
  }
  await expect(calculatorPanel).toBeVisible();
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
  expect(payload.exam_form_id).toBe('EXAM_180_V1');
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

  const cards = page.locator('.gpt-launcher-item');
  await expect(cards).toHaveCount(9);
  await expect(cards.nth(0)).toContainText('For PGY-5 ready to challenge the exam.');
  await expect(cards.nth(1)).toContainText('For PGY-3/4/5 who are currently on their Health Promotion block');
  await expect(cards.nth(7)).toContainText('incidence management systems structure');

  const iconBoxes = await page.locator('.gpt-launcher-icon').evaluateAll((icons) => icons.map((icon) => {
    const iconRect = icon.getBoundingClientRect();
    const cardRect = icon.closest('.gpt-launcher-item').getBoundingClientRect();
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

test('all nine assistant destinations and centralized recommendation routes are release-ready', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto('/applied-exam.html');

  await expect(page.locator('.site-version-badge')).toContainText('Version 4.0');
  await page.getByRole('tab', { name: /start practising/i }).click();
  await expect(page.locator('#panel-start-practising')).toBeVisible();

  const launchers = page.locator('.gpt-launcher-item');
  await expect(launchers).toHaveCount(9);
  for (const [assistantId, expectedUrl] of Object.entries(EXPECTED_ASSISTANT_URLS)) {
    const directCard = page.locator(`.gpt-launcher-item[data-assistant-id="${assistantId}"]`);
    await expect(directCard).toHaveCount(1);
    await expect(directCard.locator('a.launch-now-btn')).toHaveAttribute('href', expectedUrl);
  }

  const customGptUrls = [EXPECTED_ASSISTANT_URLS['gpt-3'], EXPECTED_ASSISTANT_URLS['gpt-4']];
  for (const url of customGptUrls) {
    expect(url).toMatch(/^https:\/\/chatgpt\.com\/g\/g-[^\s]+$/);
  }
  await expect(page.locator('.gpt-launcher-item .open-gpt-btn-disabled')).toHaveCount(0);
  await expect(page.locator('.gpt-launcher-item a[href^="https://chat.openai.com"]')).toHaveCount(0);

  const launcherRoutes = await launchers.evaluateAll((cards) => Object.fromEntries(cards.map((card) => [
    card.querySelector('.gpt-launcher-title').textContent.trim(),
    card.querySelector('a.launch-now-btn').getAttribute('href')
  ])));

  await page.getByRole('tab', { name: /challenge scenarios/i }).click();
  await expect(page.locator('#panel-challenge-scenarios')).toBeVisible();
  const scenarioRoutes = await page.locator('.challenge-scenario-card').evaluateAll((cards) => cards.map((card) => ({
    title: card.querySelector('.recommended-gpt').textContent.trim(),
    href: card.querySelector('a.open-gpt-btn').getAttribute('href')
  })));
  expect(scenarioRoutes.length).toBeGreaterThan(0);
  for (const route of scenarioRoutes) {
    expect(route.href).toBe(launcherRoutes[route.title]);
  }

  await page.getByRole('tab', { name: /build a station/i }).click();
  await expect(page.locator('#panel-builder')).toBeVisible();
  await page.locator('#builder-topic').selectOption('emergency');
  await expect(page.locator('#builder-open-gpt')).toHaveAttribute('href', EXPECTED_ASSISTANT_URLS['gpt-8']);
  await expect(page.locator('#builder-open-gpt')).toContainText('Open Recommended Assistant');
  expect(pageErrors).toEqual([]);
});

test('written landing banner and intro stay centered with updated title', async ({ page }) => {
  await page.goto('/index.html');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Public Health & Preventive Medicine Written SAQ Simulator');
  await expect(page.getByRole('link', { name: 'Written SAQ Simulator' })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('.landing-intro')).toContainText(/This simulator approximates the written short.answer question/);
  await expect(page.locator('.site-version-badge')).toContainText('Version 4.0 • NRC 2026');
  await expect(page.locator('.version-highlights')).toContainText('What’s new in Version 4.0');

  const introAlignment = await page.locator('.landing-intro').evaluate((node) => {
    const rect = node.getBoundingClientRect();
    const parentRect = node.parentElement.getBoundingClientRect();
    const midpoint = rect.left + (rect.width / 2);
    const parentMidpoint = parentRect.left + (parentRect.width / 2);
    return Math.abs(midpoint - parentMidpoint);
  });

  expect(introAlignment).toBeLessThan(24);
});

test('written landing exposes only full and focused starts, and focused launches EXAM_AHD_15', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto('/index.html');

  const choices = page.locator('.exam-option[data-exam-form-id]');
  await expect(choices).toHaveCount(2);
  expect(await choices.evaluateAll((nodes) => nodes.map((node) => node.dataset.examFormId).sort())).toEqual([
    'EXAM_180_V1',
    'EXAM_AHD_15'
  ]);
  await expect(page.locator('#start-practice')).toHaveCount(0);
  await expect(page.locator('.exam-option[data-exam-form-id="EXAM_AHD_15"]')).toContainText('15 minutes • 4 questions');
  await expect(page.locator('.exam-option[data-exam-form-id="EXAM_180_V1"]')).toContainText('3 hours • Full simulation');

  await page.locator('#start-ahd').click();
  await expect(page.locator('#exam')).toBeVisible();
  await expect(page.locator('#question-list li')).toHaveCount(4);
  expect(await page.evaluate(() => localStorage.getItem('saq_legacy_mode'))).toBe('ahd');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('saq_legacy_selected_ids')))).toEqual(['Q1', 'Q4', 'Q5', 'Q6']);
  expect(pageErrors).toEqual([]);
});

test('mobile-width landing and Applied assistant grid remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/index.html');
  await expect(page.locator('.exam-option[data-exam-form-id]')).toHaveCount(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBeTruthy();

  await page.goto('/applied-exam.html');
  await page.getByRole('tab', { name: /start practising/i }).click();
  await expect(page.locator('.gpt-launcher-item')).toHaveCount(9);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBeTruthy();
});

test.describe('Deterministic mode smoke flow', () => {
  test('legacy mode load + full flow', async ({ page }) => {
    await page.goto('/index.html');
    await runCommonFlow(page, 'legacy');

    const keys = await page.evaluate(() => Object.keys(localStorage));
    // A submitted attempt clears its own resumable session state.
    expect(keys.some((key) => key.startsWith('saq_legacy_'))).toBeFalsy();
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
    // Completing pilot mode clears only the pilot session and preserves legacy state.
    expect(keys.some((key) => key.startsWith('saq_pilot_'))).toBeFalsy();

    await context.close();
  });
});
