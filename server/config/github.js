const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const OWNER = process.env.GITHUB_USERNAME;
const REPO  = process.env.GITHUB_REPO;

// push file to github
const pushFileToGithub = async (filePath, content, message) => {
  try {
    let sha = undefined;
    try {
      const { data } = await octokit.repos.getContent({
        owner: OWNER,
        repo:  REPO,
        path:  filePath,
      });
      sha = data.sha;
    } catch (err) {
      // file does not exist — will create new
    }

    await octokit.repos.createOrUpdateFileContents({
      owner:   OWNER,
      repo:    REPO,
      path:    filePath,
      message: message,
      content: Buffer.from(content).toString("base64"),
      sha:     sha,
    });

    return true;
  } catch (error) {
    console.error("GitHub push error:", error.message);
    return false;
  }
};

// get file from github
const getFileFromGithub = async (filePath) => {
  try {
    const { data } = await octokit.repos.getContent({
      owner: OWNER,
      repo:  REPO,
      path:  filePath,
    });

    const content = Buffer.from(data.content, "base64").toString("utf8");
    return content;
  } catch (error) {
    console.error("GitHub get error:", error.message);
    return null;
  }
};

module.exports = {
  pushFileToGithub,
  getFileFromGithub,
};