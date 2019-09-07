const puppeteer = require("puppeteer");

const BASE_URL = "https://instagram.com/";
const TAG_URL = (tag) => `https://www.instagram.com/explore/tags/${tag}/`;

const instagram = {
  browser: null,
  page: null,

  initialize: async () => {
    instagram.browser = await puppeteer.launch({ headless: false });
    instagram.page = await instagram.browser.newPage();
  },
  login: async (username, password) => {

    await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2'});

    let loginButton = await instagram.page.$x('//a[contains(text(), "로그인")]')

    await loginButton[0].click();
    await instagram.page.waitForNavigation({ waitUntil: 'networkidle2'});
    
    await instagram.page.waitFor(2000);

    await instagram.page.type('input[name="username"]', username, { delay: 50 });
    await instagram.page.type('input[name="password"]', password, { delay: 50 });

    loginButton = await instagram.page.$x('//div[contains(text(), "로그인")]')

    await loginButton[0].click();

    // 만약 인증하라는 창 때문에 멈추었다면
    // await instagram.page.waitFor(100000);
    await instagram.page.waitFor('a > span[aria-label="프로필"]');
  },
  end: async () => {
    await instagram.page.close();
  },

  likeTagsProcess: async (tags = []) => {
    for (let tag of tags) {

      await instagram.page.goto(TAG_URL(tag), { waitUntil: 'networkidle2'});
      await instagram.page.waitFor(1000);

      let posts = await instagram.page.$$('article > div:nth-child(3) img[decoding="auto"]');

      for (let i=0; i < 4; i++) {
        let post = posts[i];

        await post.click();

        // 잘 안되면 해당 요소에 클릭 기능이 없을 수 있으으니 page에서 시도해볼것

        await instagram.page.waitFor('span[id="react-root"][aria-hidden="true"]');
        await instagram.page.waitFor(1000)

        let isLikable = await instagram.page.$('span[aria-label="좋아요"]');

        if (isLikable) {
          await instagram.page.click('span[aria-label="좋아요"]')
          console.log('좋아요')
        }

        let closeModalButton = await instagram.page.$x('//button[contains(text(), "닫기")]')

        await closeModalButton[0].click();

        await instagram.page.waitFor(1000);

      }

      await instagram.page.waitFor(6000);

    }
  }
}

module.exports = instagram;