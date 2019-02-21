module.exports = arrElementList => `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>The Elements</title>
      <link rel="stylesheet" href="/css/styles.css" />
    </head>
    <body>
      <h1>The Elements</h1>
      <h2>These are all the known elements.</h2>
      <h3>There are ${arrElementList.length} elements listed here:</h3>
      <ol>
        ${arrElementList.join("")}
      </ol>
    </body>
  </html>
  `;
