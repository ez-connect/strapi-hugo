const execSync = require('child_process').execSync;
const path = require('path');

const reflect = require('@alumna/reflect');

function Builder() {
  this._outputDir = process.env.OUTPUT_DIR;
  this._gitBranch = process.env.GIT_BRANCH;
  this._gitCommitMessage = process.env.GIT_BRANCH;
  this._timeout = Number.parseInt(process.env.BUILD_TIMEOUT) ?? 30000;

  this._timer = null;
}

Builder.prototype.setOutputDir = function (value) {
  this._outputDir = value;
};

Builder.prototype.queueBuild = function () {
  clearTimeout(this._timer);
  this._timer = setTimeout(this.build.bind(this), this._timeout);
};
Builder.prototype.build = async function () {
  console.log('CMS build:', this._outputDir);

  // Rsync media files
  await reflect({
    src: path.join('public', 'uploads/'),
    dest: path.join(this._outputDir, 'static', 'uploads/'),
    // (OPTIONAL) Default to 'true'
    recursive: true,
    // (OPTIONAL) Default to 'true'
    // Delete in dest the non-existent files in src
    delete: true,
    // (OPTIONAL)
    // Array with files and folders not to reflect
    exclude: ['.gitkeep'],
  });

  // Git
  const option = { cwd: this._outputDir };

  if (this._gitBranch) {
    execSync(`git checkout ${this._gitBranch}`, option);
    execSync('git add .', option);
  }

  if (this._gitCommitMessage) {
    execSync(`git commit -m "${this._gitCommitMessage}"`, option);
    execSync('git push', option);
  }

  // Hugo
  execSync('hugo --gc --minify', option);
};

module.exports = {
  builder: new Builder(),
};
