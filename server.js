const http = require("http");
const fs = require("fs");
// const headData = require("./head.js");
const querystring = require("querystring");
const dirElements = __dirname + "/public/elements/";

const PORT = 8181;
const fx = require("./functions.js");

const server = http.createServer((req, res) => {
  const { method, url } = req;
  let arrBody = [];

  //console.log("method: ", method);
  //console.log("url: ", url);
  const authorization = req.headers.authorization;
  // console.log("Headers: ", JSON.stringify(req.headers));
  // console.log("authorization: ", authorization);
  if (method !== "GET") {
    // need authentication to proceed
    if (!authorization) {
      res.statusCode = 401;
      res.setHeader(`WWW-Authenticate`, `Basic realm="Secure Area"`);
      res.end(`<html><body>Not Authorized</body></html>`);
      return;
    } else {
      const authorizationStripped = authorization.replace(
        "Y2hhcmxlczoxMjM0NQ==",
        ""
      );
      console.log("authorization: ", authorization);
      console.log("authorizationStripped: ", authorizationStripped);
      const credResults = fx.doCredentialsMatch(authorizationStripped);
      console.log("credResults: ", credResults);
      /*
      if (!credResults) {
        res.statusCode = 401;
        res.setHeader(`WWW-Authenticate`, `Basic realm="Secure Area"`);
        res.end(`<html><body>Invalid Authentication Credentials</body></html>`);
        return;
      }*/
    }
  }

  switch (method) {
    case "GET":
      switch (url) {
        case "/css/styles.css":
          fs.readFile("./public/css/styles.css", (err, data) => {
            if (err) {
              console.log(err);
            }
            // res.writeHead(200, { "Content-Type": "text/css" });

            res.statusCode = 200;
            res.setHeader("Content-Type", "text/css");
            res.write(data.toString());
            res.end();
          });
          break;
        case "/":
          fs.readdir(dirElements, (err, files) => {
            if (err) {
              console.log("Err: ", err);
            }
            const arrDirectory = [];
            // console.log("files: ", files);
            files.forEach(fileName => {
              console.log(fileName);
              arrDirectory.push(fileName);
            });
            // console.log("arrDirectory: ", arrDirectory);

            const arrElementList = arrDirectory.map(name => {
              name = name.split(".")[0];
              const createListItemFromTemplate = require("./templateListItem.js");
              const htmlListItem = createListItemFromTemplate(name);
              // console.log("htmlListItem", htmlListItem);
              return htmlListItem;
            });

            console.log(
              "arrElementList: ",
              arrElementList,
              arrElementList.length
            );

            const createIndexFromTemplate = require("./templateIndex.js");

            const htmIndex = createIndexFromTemplate(arrElementList);
            // console.log("htmIndex: ", htmIndex);
            // res.writeHead(200, { "Content-Type": "text/html" });

            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.write(htmIndex);
            // const serverResponse = `${headData.status200}\n\n`;

            res.end();
            // res.end(serverResponse);
            return htmIndex;
          });

          break;
        case "/favicon.ico":
          break;
        default:
          // formulate file name & check if exists (serve it), else 404
          const fileNameToLoad = "./public/elements" + url;
          console.log("fileNameToLoad: ", fileNameToLoad);
          fs.readFile(fileNameToLoad, (err, data) => {
            if (err) {
              console.log(err);
              console.log("It's broke!");
              fs.readFile("./public/404.html", (err, data) => {
                if (err) {
                  console.log(err);
                  console.log("It's really broke!");
                }
                // res.writeHead(404, { "Content-Type": "text/html" });

                res.statusCode = 404;
                res.setHeader("Content-Type", "text/html");
                res.write(data.toString());
                res.end();
                return;
              });
              return;
            }
            // res.writeHead(200, { "Content-Type": "text/html" });
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.write(data.toString());
            res.end();
          });
          break;
      }
      break;
    case "POST":
      arrBody = [];
      req
        .on("data", chunk => {
          arrBody.push(chunk);
        })
        .on("end", () => {
          const strBody = Buffer.concat(arrBody).toString();
          // at this point, `body` has the entire request body stored in it as a string
          const objBody = querystring.parse(strBody);
          // console.log("objBody: ", objBody);
          const fileNameShort = objBody.elementName.toLowerCase() + ".html";
          const fileName = dirElements + fileNameShort;
          const createElementFromTemplate = require("./templateElement.js");
          const data = createElementFromTemplate(objBody);

          fs.open(fileName, "wx", (err, fd) => {
            //wx - open for writing, fail if already exists
            if (err) {
              if (err.code === "EEXIST") {
                console.error(
                  `${method} Error: ${fileNameShort} already exists`
                );
                res.statusCode = 418;
                res.setHeader("Content-Type", "application/json");
                res.end(`{ "success" : false }`);
                return;
              }
              throw err;
            }
            fs.writeFile(fileName, data, err => {
              if (err) {
                console.error(`${method} Error: ${fileNameShort} ${err}.`);
                return;
              }
              console.log(`${method}: ${fileNameShort} added.`);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(`{ "success" : true }`);
            });
          });
        });

      break;
    case "PUT":
      arrBody = [];
      req
        .on("data", chunk => {
          arrBody.push(chunk);
        })
        .on("end", () => {
          const strBody = Buffer.concat(arrBody).toString();
          // at this point, `body` has the entire request body stored in it as a string
          const objBody = querystring.parse(strBody);
          // console.log("objBody: ", objBody);
          const fileNameShort = objBody.elementName.toLowerCase() + ".html";
          const fileName = dirElements + fileNameShort;
          const createElementFromTemplate = require("./templateElement.js");
          const data = createElementFromTemplate(objBody);
          console.log("data: ", data);
          fs.open(fileName, "r+", (err, fd) => {
            //r+ - open for reading/writing, fail if not exist
            console.log("data2: ", data);

            if (err) {
              if (err.code === "ENOENT") {
                console.error(
                  `${method} Error: ${fileNameShort} does not exist`
                );
                res.statusCode = 418;
                res.setHeader("Content-Type", "application/json");
                res.end(`{ "success" : false }`);
                return;
              }
              throw err;
            }
            fs.writeFile(fileName, data, err => {
              if (err) {
                console.error(`${method} Error: ${fileNameShort} ${err}.`);
                return;
              }
              console.log(`${method}: ${fileNameShort} updated!`);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(`{ "success" : true }`);
            });
          });
        });

      break;
    case "DELETE":
      const fileNameToRemove = "./public/elements" + url;
      // console.log("delete url: ", fileNameToRemove);
      fs.unlink(fileNameToRemove, err => {
        if (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          const errMsg = `resource ${url} does not exist`;
          console.log(method + " Error: ", errMsg);
          res.end(`{ "error" :  ${errMsg}`);
          return;
          // throw err;
        }
        console.log(`${method}: ${url} removed!`);

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(`{ "success" : true }`);
      });
      break;
  }
});

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
