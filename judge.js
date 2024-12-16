function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function allgood() {
  let matches = document.evaluate(
    '//div[@id="txwj-index-card"]//label[text()[contains(.,"很好")]]//input[@type="radio"]',
    document,
    null,
    XPathResult.ANY_TYPE,
    null,
  );

  let good = matches.iterateNext();
  while (good) {
    good.checked = true;
    good = matches.iterateNext();
  }
}

async function submit() {
  let submit = document
    .evaluate(
      '//footer[@id="txwjFooter"]//a[text()[contains(.,"提交")]]',
      document,
      null,
      XPathResult.ANY_TYPE,
      null,
    )
    .iterateNext();
  submit.click();

  await sleep(200);

  let confirm = document
    .evaluate(
      '//a[text()[contains(.,"确认")]]',
      document,
      null,
      XPathResult.ANY_TYPE,
      null,
    )
    .iterateNext();
  if (confirm) confirm.click();

  await sleep(4000);

  let no_recommend = document
    .evaluate(
      '//div[@id="buttons"]//button[text()[contains(.,"暂不推荐")]]',
      document,
      null,
      XPathResult.ANY_TYPE,
      null,
    )
    .iterateNext();
  if (no_recommend) no_recommend.click();

  await sleep(200);

  let no_tas = document
    .evaluate(
      '//div[@class="bh-dialog-btnContainerBox"]//a[text()[contains(.,"暂时不评")]]',
      document,
      null,
      XPathResult.ANY_TYPE,
      null,
    )
    .iterateNext();
  if (no_tas) no_tas.click();
}

async function next() {
  let next = document
    .evaluate(
      '//section[@class="ckdwpj"]//div[@class="card-btn blue"]',
      document,
      null,
      XPathResult.ANY_TYPE,
      null,
    )
    .iterateNext();
  if (next == null) {
    return false;
  }
  next.click();
  return true;
}

async function main() {
  while (await next()) {
    await sleep(1000);
    allgood();
    await submit();
  }
}

await main();
