const puppeteer = require("puppeteer");
const instagram = require("./instagram.js");

(async () => {
  const USER_NAME = "01034303210";
  const PASSWORD = "ahqkdlf#01";

  await instagram.initialize();
  await instagram.login(USER_NAME, PASSWORD);

  await instagram.likeTagsProcess(['mossebo', 'amorecipes'])

})();