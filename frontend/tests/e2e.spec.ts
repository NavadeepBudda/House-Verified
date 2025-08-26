import { test, expect } from '@playwright/test';

const WEB = process.env.WEB || 'http://localhost:5173';
const API = process.env.API || 'http://localhost:4000';

test.describe('House Verified E2E Tests', () => {
  test('homepage loads and shows samples', async ({ page }) => {
    await page.goto(WEB + '/');
    
    // Check page title and header
    await expect(page.getByText('Trust what you read from the House.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'House Verified' })).toBeVisible();
    
    // Check navigation
    await expect(page.getByRole('link', { name: 'Showcase' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Verify' })).toBeVisible();
    
    // Check sample assets section
    await expect(page.getByText('Samples')).toBeVisible();
    
    // Check for at least one sample row
    const sampleRows = page.locator('[href^="/asset/"]');
    await expect(sampleRows.first()).toBeVisible();
  });

  test('showcase -> asset -> proof panel flow', async ({ page }) => {
    await page.goto(WEB + '/');
    
    // Wait for samples to load
    await expect(page.getByText('Samples')).toBeVisible();
    
    // Click first sample row
    const firstSample = page.locator('[href^="/asset/"]').first();
    await expect(firstSample).toBeVisible();
    await firstSample.click();
    
    // Should be on asset page
    await expect(page).toHaveURL(/\/asset\/.+/);
    
    // Should see verified badge or status indicator
    const statusElements = page.locator('button:has-text("Verified"), button:has-text("Signature"), button:has-text("failed")');
    await expect(statusElements.first()).toBeVisible();
    
    // Click to open proof panel
    const proofButton = page.locator('button').filter({ hasText: /Verified|Signature|failed|proof|Proof/ }).first();
    await proofButton.click();
    
    // Should see proof panel
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Proof of Origin')).toBeVisible();
    
    // Close with X button
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('verify page works with URL input', async ({ page }) => {
    await page.goto(WEB + '/verify');
    
    // Check page elements
    await expect(page.getByText('Verify a House file')).toBeVisible();
    await expect(page.getByPlaceholder(/https:\/\/example\.com/)).toBeVisible();
    
    // Test URL verification with a seeded file
    const urlInput = page.getByPlaceholder(/https:\/\/example\.com/);
    await urlInput.fill(`${API}/files/flyer.verified.png`);
    
    await page.getByRole('button', { name: 'Check' }).click();
    
    // Should see verification summary
    await expect(page.getByText('Verification Summary')).toBeVisible({ timeout: 10000 });
    
    // Should see some status
    const statusPill = page.locator('[class*="border-green"], [class*="border-red"], [class*="border-amber"]').first();
    await expect(statusPill).toBeVisible();
    
    // Test proof panel opening
    await page.getByRole('button', { name: 'View proof' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Proof of Origin')).toBeVisible();
    
    // Close with escape
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('verify page file upload works', async ({ page }) => {
    await page.goto(WEB + '/verify');
    
    // Create a test file
    const fileContent = 'Test file content for House Verified';
    
    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from(fileContent)
    });
    
    // Should see verification summary
    await expect(page.getByText('Verification Summary')).toBeVisible({ timeout: 10000 });
    
    // Should see some status (likely unknown for random test file)
    const statusElements = page.locator('[class*="border-green"], [class*="border-red"], [class*="border-amber"]');
    await expect(statusElements.first()).toBeVisible();
  });

  test('navigation between pages works', async ({ page }) => {
    // Start at home
    await page.goto(WEB + '/');
    await expect(page.getByText('Trust what you read from the House.')).toBeVisible();
    
    // Navigate to verify
    await page.getByRole('link', { name: 'Verify' }).click();
    await expect(page).toHaveURL(/\/verify/);
    await expect(page.getByText('Verify a House file')).toBeVisible();
    
    // Navigate back to showcase
    await page.getByRole('link', { name: 'Showcase' }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Trust what you read from the House.')).toBeVisible();
  });

  test('error handling - invalid asset ID', async ({ page }) => {
    // Try to access non-existent asset
    await page.goto(WEB + '/asset/nonexistent');
    
    // Should handle gracefully, either show error or fallback content
    // Don't expect any unhandled errors or blank pages
    await expect(page.locator('body')).not.toBeEmpty();
    
    // Should still have navigation
    await expect(page.getByRole('link', { name: 'House Verified' })).toBeVisible();
  });

  test('responsive design - mobile viewport', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(WEB + '/');
    
    // Should still show main content
    await expect(page.getByText('Trust what you read from the House.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'House Verified' })).toBeVisible();
    
    // Navigation should be accessible
    await expect(page.getByRole('link', { name: 'Verify' })).toBeVisible();
  });
});