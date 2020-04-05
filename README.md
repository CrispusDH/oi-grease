# puppeteer-helpers
Bunch of help methods for e2e automation testing via Puppeteer

# Purpose
Several examples why library exists:

 * You always have some troubles with click?
`waitForSelector()` does not help sometimes and you use `$eval(selector, (node) => node.click()`?
Please, stop clicking using JS if you write e2e UI tests. Our user does not interact with browser in such maner!

**Was**:
```typescript
    await page.waitForSelector(selector, { timeout:30000 });
    await page.$eval(selector, (e: any) => e.click());
```

**with Grease**:
```typescript
await click(page, selector);
```

`click()` will wait when `Puppeteer` find element and also when element become visible.

Library has other useful methods in API.md (TBD)

 * You aware `Puppeteer` does not have `getText()` method, strange but truth

 **Was**:
 ```typescript
  await page.waitForSelector(selector);
  const text = await page.$eval(selector, (el: any) => el.innerText);
 ```

 **with Grease**:
 ```typescript
 const text = await getText(page, selector);
 ```

`getText()`  will wait when `Puppeteer` find element and also when element become visible.
Only after that get text of element.

# API
TBD

# Contribution guide
TBD
