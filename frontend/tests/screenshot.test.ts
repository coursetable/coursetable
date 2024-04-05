import { test } from '@playwright/test';
import { argosScreenshot } from '@argos-ci/playwright';

const pages = [
  { name: 'Catalog', path: '/catalog' },
  { name: 'Worksheet', path: '/worksheet' },
  { name: 'Course modal', path: '/catalog?course-modal=202403-11206' },
];

for (const { name, path } of pages) {
  test(`Run Argos on ${name} (${path})`, async ({ page }) => {
    await page.goto(path);
    await argosScreenshot(page, name);
  });
}
