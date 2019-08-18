const fs = require("fs");
const { exec } = require("child_process");

const folderNames = fs.readdirSync("./helm_charts");

// TODO: instead of charts folder have a package.json like structure that this loads and saves to helm_charts
// build a helm.json with chartName => versio

folderNames.forEach(folderName => {
  if (!folderName.includes(".")) {
    const targetFolder = `${process.cwd()}/${folderName}`;

    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder);
    }

    exec(
      `helm template helm_charts/${folderName} --name ${folderName} > ${process.cwd()}/${folderName}/${folderName}-chart.yaml`,
      error => {
        if (error) {
          return console.log("ERROR:", error);
        }

        console.log(`${folderName}-chart.yaml is built`);
      }
    );
  }
});