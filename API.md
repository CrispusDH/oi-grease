# Grease API

##### Table of Contents

- [actions](#actions)
  * [getElement](#getelement)
  * [click](#click)
  * [type](#type)
  * [getText](#gettext)
  * [getAttribute](#getattribute)
- [predicates](#predicates)
  * [isElementFound](#iselementfound)
  * [isElementVisible](#iselementvisible)
  * [isElementNotDisabled](#iselementnotdisplayed)
- [small](#small)
  * [pause](#pause)
- [waitFor](#waitfor)
- [collection](#collection)
  * [filterWithWaiting](#filterwithwaiting)
  * [findWithWaiting](#findwithwaiting)
- [verify](#verify)
  * [checkElementIsInteractable](#checkelementisinteractable)

### actions

Set of `actions` that typically use during UI automation. Each of it wait that element will be [found](#iselementfound), [visible](#iselementvisible) and [not disabled](iselementnotdisabled).

#### getElement
- `page` Puppeteer's Page instance
- `selector` <string> that represent CSS Selector
- returns: `Promise<ElementHandle>` Puppeteer's Element instance

The method [waitFor](#waitfor) Element will be [found](#iselementfound), [visible](#iselementvisible) and [not disabled](iselementnotdisabled) and only after it returns this Element.
If some of these conditions will not pass it throw an error with `selector` of this Element and condition which Element did not pass.

#### click
- `page` Puppeteer's <Page> instance
- `selectorOrElement` <string> that represent CSS Selector | <ElementHandle> in this case click will be without waiting
- `options?` Optional, <Object>
  * `shouldURLbeChanged` <boolean> wait for new URL after click, if url was not changed then click again
  * `waitForElement` <string> wait for element (that will be found by CSS Selector from this argument), if element did not found/visible/disabled then click again
  * `waitForPredicate` <() => boolean | Promise<boolean>> wait for predicate is getting `true` in 3 sec, if not then click again
- returns: `Promise<void>`


Wrap common Puppeteer click to be closer to conditions when User can click Element. You should wait before clicking that an Element is found && visible && not disabled

#### type
- `text`: string,
- `page` Puppeteer's <Page> instance
- `selectorOrElement` <string> that represent CSS Selector | <ElementHandle> in this case click will be without waiting
- `options?` Optional, <Object>
  * `delay` <number> time to wait between key presses in milliseconds. Defaults to 0.
  * `clear` <boolean> clear input field before typing (using fast 3 times clicking approach, maybe approach will be changed TBD)
- returns: `Promise<void>`


Wrap common Puppeteer type to be closer to conditions when User can type. You should wait before typing that an Element is found && visible && not disabled.

#### getText
- `page` Puppeteer's <Page> instance
- `selectorOrElement` <string> that represent CSS Selector | <ElementHandle> in this case click will be without waiting
- returns: `string` text in element


Get text using `node.textContent` property. Wait before an Element is found && visible && not disabled.

#### getAttribute
- `attribute` <string> name of attribute
- `page` Puppeteer's <Page> instance
- `selectorOrElement` <string> that represent CSS Selector | <ElementHandle> in this case click will be without waiting
- returns: `string` value of this attribute


Get attribute using `node.getAttribute(attribute)`. Wait before an Element is found && visible && not disabled.

### predicates

Set of predicates that can be used when you want to check a condition of Element. Usually predicate is using within [waitFor](#waitfor)

#### isElementFound
- `page` Puppeteer's <Page> instance
- `selector` <string> that represent CSS Selector
- returns: `Promise<boolean>`


check is element was found in DOM by Puppeteer

#### isElementVisible
- `page` Puppeteer's <Page> instance
- `selector` <string> that represent CSS Selector
- returns: `Promise<boolean>`


check is element visible by several conditions:
- CSS Style `visibilty` property is not `hidden`
- element has bounding box (relative to the main frame), so we expect element is visible

for sure amount of conditions can be increased endlessly

#### isElementNotDisabled
- `page` Puppeteer's <Page> instance
- `selector` <string> that represent CSS Selector
- returns: `Promise<boolean>`


check that element does not have attribute `disabled`

### small

tiny methods to make our life easier

#### pause
- `ms` <number> amount of milliseconds to wait

just `setTimeout` trick

### waitFor
- `predicate` <() => boolean | Promise<boolean>> arrow function that return either boolean or Promise<boolean>
- `options` <Object>
  * `timeout` <number> amount of milliseconds for trying pass predicate. Defaults to 30 sec.
  * `message` <stirng> message that you can add in case of predicate was not getting `true`
  * `pollTime` <number> amount of milliseconds between attempts. Defaults to 200 ms.


Method that is fundamental for UI automation. Check predicate and if false then check it again after some time (200ms by default). So, we can ensure that some conditions are ready.
Will `throw` an error in case of predicate was not getting `true`.
Improve stacktrace - TBD.


### collection
it's raw implementation of working with array of Elements

#### filterWithWaiting
- `input` <() => PromiseLike<Iterable<T | PromiseLike<T>>>> arrow function that returns PromiseLike iterable of T
- `filterer` <(element: T, index: number) => boolean | PromiseLike<boolean>> filterer arrow function
- `filterOptions` <Object>
  * `timeout` <number> under the hood here using [waitFor](#waitfor), and timeout pass there. Defaults to 30 sec.
- returns: `T[]` array with filtered items, throw error if nothing was matched


Try to filter Iterable object, wait if filter did not find anything.

Example:

```typescript
    const elements = await filterdWithWaiting(
      () => this.page.$$(`${this.root} [data-hook="list-item-select"]`),
      async node => {
        const text = await getText(this.page, node);
        return text === variable;
      },
    );
```

#### findWithWaiting
- `input` <() => PromiseLike<Iterable<T | PromiseLike<T>>>> arrow function that returns PromiseLike iterable of T
- `filterer` <(element: T, index: number) => boolean | PromiseLike<boolean>> filterer arrow function
- `filterOptions` <Object>
  * `timeout` <number> under the hood here using [waitFor](#waitfor), and timeout pass there. Defaults to 30 sec.
- returns: `T` first filtered item, throw error if nothing was matched


Try to filter Iterable object, wait if filter did not find anything.

Example:

```typescript
    const element = await filterdWithWaiting(
      () => this.page.$$(`${this.root} [data-hook="list-item-select"]`),
      async node => {
        const text = await getText(this.page, node);
        return text === variable;
      },
    );
```

### verify

TBD
