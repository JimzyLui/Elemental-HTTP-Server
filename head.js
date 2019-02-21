"use strict";

// const date = new Date().toUTCString;
const date = new Date();

const getHeadStatus = (statusNo, contentType) => {
  const date = new Date();
  if (!statusNo) statusNo = "200";
  if (!contentType) contentType = "text/html";
  return `HTTP/1.1 ${statusNo}\nContent-Type:${contentType}\nLast-Modified:${date}`;
};
const strHeadStatus200 = `HTTP/1.1 200\nContent-Type:text/html\nLast-Modified:${date}`;
const strHeadStatus304 = `HTTP/1.1 304\nContent-Type:text/html\nDate:${date}`;

// generate a head string
const getHead = objHead => {
  // referrer is the whole url string
  const objHeadTemplate = {
    start: "GET " + objHead.page + " HTTP/1.1",
    host: "Host: " + objHead.host,
    connection: "Connection: keep-alive",
    userAgent:
      "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
    dnt: "DNT: 1",
    accept: "Accept: image/webp,image/apng,image/*,*/*;q=0.8",
    referrer: "Referer: " + objHead.referrer,
    acceptEncoding: "Accept-Encoding: gzip, deflate, br",
    acceptLanguage: "Accept-Language: en-US,en;q=0.9",
    ifModifiedSince: date,
    end: "\n\n"
  };
  return Object.values(objHeadTemplate).join("\r");
};

module.exports = {
  status200: strHeadStatus200,
  status304: strHeadStatus304,
  getHead: getHead,
  getHeadStatus: getHeadStatus
};
