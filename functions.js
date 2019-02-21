const fs = require("fs");

const dirElements = __dirname + "/public/elements/";

const arrAuthorized = [
  { userName: "jimzy", password: "test" },
  { userName: "jen", password: "keygen" }
];
const getCredentialsObj = encodedString => {
  objAuth = {};
  const base64Buffer = new Buffer(encodedString, "base64");
  const decodedString = base64Buffer.toString();
  const tupleAuth = decodedString.split(":");
  console.log("decodedString: ", decodedString);
  objAuth.userName = tupleAuth[0];
  objAuth.password = tupleAuth[1];
  return objAuth;
};
const findUser = userName => {
  const user = arrAuthorized.filter(x => x.userName === userName).pop();
  if (user) {
    return user;
  } else {
    return {};
  }
};

const doCredentialsMatch = encodedString => {
  const objCred = getCredentialsObj(encodedString);
  const objResults = findUser(objCred.userName);
  if (objResults.hasOwnProperty("userName")) {
    // compare passwords
    if (objResults.password === objCred.password) {
      return true;
    }
  }
  return false;
};

const getUpdatedIndexFile = () => {
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

    const arrElementList = arrDirectory
      .map(name => {
        name = name.split(".")[0];
        const createListItemFromTemplate = require("./templateListItem.js");
        const htmlListItem = createListItemFromTemplate(name);
        // console.log("htmlListItem", htmlListItem);
        return htmlListItem;
      })
      .join("");
    const createIndexFromTemplate = require("./templateIndex.js");
    // console.log("arrElementList: ", arrElementList);

    const htmIndex = createIndexFromTemplate(arrElementList);
    // console.log("htmIndex: ", htmIndex);
    return htmIndex;
  });
};

const createFile = objElementData => {
  const fileName =
    dirElements + objElementData.elementName.toLowerCase() + ".html";
  const createElementFromTemplate = require("./templateElement.js");
  const data = createElementFromTemplate(objElementData);

  fs.open(fileName, "wx", (err, data) => {
    //wx - open for writing, fail if already exists
    if (err) {
      if (err.code === "EEXIST") {
        console.error(fileName + " already exists");
        return;
      }
      throw err;
    }
  });
};

const updateFile = objElementData => {
  const fileName =
    dirElements + objElementData.elementName.toLowerCase() + ".html";
  // console.log("fileName: ", fileName);
  const createElementFromTemplate = require("./templateElement.js");
  const data = createElementFromTemplate(objElementData);
  /*
  fs.writeFile(fileName, data, err => {
    if (err) {
      console.log("Err: ", err);
    }
    //console.log(fileName + ": ", data);
  });*/
  fs.open(fileName, "wx", (err, data) => {
    //wx - open for writing, fail if already exists
    if (err) {
      if (err.code === "EXIST") {
        console.error(fileName + " already exists");
        return;
      }
      throw err;
    }

    // writeMyData(fd);
  });
};

const deleteFile = fileName => {
  fileName = dirElements + fileName;
  // console.log("fileName: ", fileName);
  fs.unlink(fileName, err => {
    if (err) {
      throw err;
    }
    console.log("File Removed!");
  });
};

module.exports = {
  doCredentialsMatch: doCredentialsMatch,
  // getArrDirectory: getArrDirectory,
  // createFile: createFile,
  deleteFile: deleteFile
};
