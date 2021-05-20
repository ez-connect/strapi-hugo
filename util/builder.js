const execSync = require('child_process').execSync;
const path = require('path');

const reflect = require('@alumna/reflect');

function Builder() {
  this._outputDir = process.env.OUTPUT_DIR;
  this._gitBranch = process.env.GIT_BRANCH;
  this._gitCommitMessage = process.env.GIT_COMMIT_MSG;
  this._buildTimeout = Number.parseInt(process.env.BUILD_TIMEOUT);
  this._gitTimeout = Number.parseInt(process.env.GIT_TIMEOUT);

  this._buildTimer = null;
  this._gitTimer = null;
}

Builder.prototype.setOutputDir = function (value) {
  this._outputDir = value;
};

Builder.prototype.queueBuild = function () {
  if (!this._gitTimeout) return;

  clearTimeout(this._buildTimer);
  if (this._gitTimeout) {
    this._gitTimer = setTimeout(this.push.bind(this), this._gitTimeout);
  }

  if (this._buildTimeout) {
    this._buildTimer = setTimeout(this.build.bind(this), this._buildTimeout);
  }
};

Builder.prototype.push = async function () {
  console.log('CMS push to Git');
  const option = { cwd: this._outputDir };

  if (this._gitBranch) {
    execSync(`git checkout ${this._gitBranch}`, option);
    execSync('git add .', option);
  }

  if (this._gitCommitMessage) {
    execSync(`git commit -m "${this._gitCommitMessage}"`, option);
    execSync('git push', option);
  }
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

  // Hugo
  const option = { cwd: this._outputDir };
  execSync('rm -rf public', option);
  execSync('hugo --gc --minify', option);
};

module.exports = {
  builder: new Builder(),
};
