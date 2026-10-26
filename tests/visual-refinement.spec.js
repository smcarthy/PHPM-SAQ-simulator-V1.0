const { test, expect } = require('@playwright/test');

// Guard the release's visible workflows, containment and unchanged prompt copying.
for (const width of [1366, 768, 390, 320]) {
  test(`V4 presentation and controls at ${width}px`, async ({ page, context }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const noOverflow = async () => {
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    };
    const capture = async name => {
      await page.screenshot({ path: testInfo.outputPath(`${name}-${width}.png`) });
    };

    await page.goto('/index.html');
    await expect(page.locator('#start-full')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await noOverflow();
    await expect(page.locator('#exam')).toBeHidden();
    if (width === 1366) {
      const start = await page.locator('#start-full').boundingBox();
      expect(start.y + start.height).toBeLessThan(900);
    }
    await capture('written');
    await page.locator('#what-to-expect summary').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#what-to-expect p').first()).toBeVisible();
    await page.keyboard.press('Enter');
    await page.locator('#start-ahd').click();
    await expect(page.locator('#question-content input').first()).toBeVisible();
    await expect(page.locator('#landing')).toBeHidden();
    await noOverflow();
    await capture('exam');

    await page.goto('/applied-exam.html');
    await expect(page.locator('#framework-day-name')).not.toBeEmpty();
    await page.evaluate(() => document.fonts.ready);
    await noOverflow();
    await capture('applied-home');
    await page.locator('#tab-start-practising').click();
    await expect(page.locator('.gpt-launcher-item')).toHaveCount(9);
    await noOverflow();
    await page.locator('#panel-start-practising').scrollIntoViewIfNeeded();
    await capture('topic-cards');
    await expect(page.locator('.launch-now-btn').first()).toHaveCSS('color', 'rgb(255, 255, 255)');
    await expect(page.locator('.launch-now-btn').first()).toHaveCSS('text-decoration-line', 'none');
    await page.locator('.launch-now-btn').first().focus();
    await expect(page.locator('.launch-now-btn').first()).toHaveCSS('outline-style', 'solid');

    // Arrow navigation must continue to select the existing panels.
    await page.locator('#tab-start-practising').focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#panel-challenge-scenarios')).toBeVisible();
    const neighbour = await page.locator('.challenge-scenario-card').nth(1).boundingBox();
    await page.locator('.challenge-toggle').first().click();
    const expandedNeighbour = await page.locator('.challenge-scenario-card').nth(1).boundingBox();
    expect(Math.abs(neighbour.height - expandedNeighbour.height)).toBeLessThan(2);
    const scenarioPrompt = await page.locator('#challenge-prompt-0').inputValue();
    await page.locator('.copy-prompt-btn').first().click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(scenarioPrompt);
    await noOverflow();
    await page.locator('.challenge-scenario-card').first().scrollIntoViewIfNeeded();
    await capture('expanded-challenge');

    await page.locator('#tab-builder').click();
    await page.locator('#builder-topic').selectOption('emergency');
    const prompt = await page.locator('#builder-prompt').inputValue();
    expect(prompt).toContain('Emergency Preparedness');
    await page.locator('#builder-output .copy-prompt-btn').click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(prompt);
    const promptBox = await page.locator('#builder-prompt').evaluate(el => ({
      width: el.getBoundingClientRect().width,
      available: el.parentElement.getBoundingClientRect().width,
      overflow: getComputedStyle(el).overflowY
    }));
    expect(promptBox.width).toBeLessThanOrEqual(promptBox.available + 1);
    expect(promptBox.overflow).toBe('auto');
    await noOverflow();
    await page.locator('#builder-output').scrollIntoViewIfNeeded();
    await capture('builder');
    for (const tab of ['exam-tests', 'hot-topics', 'study-planner']) {
      await page.locator(`#tab-${tab}`).click();
      await noOverflow();
    }
    expect(errors).toEqual([]);
  });
}
