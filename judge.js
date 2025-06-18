function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function xpath(query, index = 1) {
  let matches = document.evaluate(
    query,
    document,
    null,
    XPathResult.ANY_TYPE,
    null,
  );
  let result;
  for (let _i = 0; _i < index; _i++) {
    result = matches.iterateNext();
  }
  return result;
}

function allgood() {
  let index = 1;
  let good = xpath(
    '//div[@id="txwj-index-card"]//label[text()[contains(.,"很好")]]//input[@type="radio"]',
    index,
  );

  while (good != null) {
    good.checked = true;

    index++;
    good = xpath(
      '//div[@id="txwj-index-card"]//label[text()[contains(.,"很好")]]//input[@type="radio"]',
      index,
    );
  }
}

async function submit() {
  let submit = xpath(
    '//footer[@id="txwjFooter"]//a[text()[contains(.,"提交")]]',
  );
  submit.click();

  await sleep(200);

  let confirm = xpath('//a[text()[contains(.,"确认")]]');
  if (confirm) confirm.click();

  await sleep(4000);

  let no_recommend = xpath(
    '//div[@id="buttons"]//button[text()[contains(.,"暂不推荐")]]',
  );
  if (no_recommend) no_recommend.click();

  await sleep(200);

  let no_tas = xpath(
    '//div[@class="bh-dialog-btnContainerBox"]//a[text()[contains(.,"暂时不评")]]',
  );
  if (no_tas) no_tas.click();
}

// 为了跳过已经出成绩、无法评教的课。从1开始。
let next_judge_button_index = 1;
async function next() {
  let judge_next = xpath(
    '//section[@class="ckdwpj"]//div[@style="display: block;"]//div[@class="card-btn blue"]',
    next_judge_button_index,
  );
  if (judge_next == null) {
    return false;
  }

  judge_next.click();

  // 如果有课已经出成绩了，就会无法评教。
  // 检测是否为该情况
  await sleep(700);
  let cannot_judge = xpath('//div[@class="bh-tip-top-bar"]');
  if (cannot_judge != null) {
    next_judge_button_index += 1;
    let close = xpath('//a[@class="bh-tip-closeIcon"]');
    close.click();
    await sleep(700);
    return await next();
  }

  return true;
}

async function main() {
  next_judge_button_index = 1;
  while (await next()) {
    await sleep(1000);
    allgood();
    await submit();
  }

  console.log("Done");
}

await main();
