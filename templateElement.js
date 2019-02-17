module.exports = objElement => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>The Elements - ${objElement.elementName}</title>
    <link rel="stylesheet" href="/css/styles.css" />
  </head>
  <body>
    <h1>${objElement.elementName}</h1>
    <h2>${objElement.elementSymbol}</h2>
    <h3>Atomic number ${objElement.elementAtomicNumber}</h3>
    <p>
    ${objElement.elementDescription}
    </p>
    <p><a href="/">back</a></p>
  </body>
</html>
`;
