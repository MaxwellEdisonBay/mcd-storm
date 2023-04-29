export const getPrepareCommitScript = ({
  repoUrl,
  repoName,
  branchName,
  isFirstLaunch,
}) => {
  const prepareCommitMessage = () => {
    return "My commit message";
  };
  const commands = [
    /*gitClone*/ ... isFirstLaunch ? [`[ -d "${repoName}" ] && git clone ${repoUrl}`] : [],
    // /*gitClone*/ `git clone ${repoUrl}`,
    /*moveToRepoDirectory*/ `cd ${repoName}`,
    /* gitUpdateMaster */ `git checkout master --force`,
    /*gitPullMaster*/ "git pull",
    /* gitCheckOut */ `git checkout ${branchName}`,
    /*changeFiles*/ "echo 'Random sample text' >> test4.txt",
    /*gitAddFiles*/ "git add .",
    /*gitCommit*/ `git commit -am "${prepareCommitMessage()}"`,
    /*gitPush*/ "git push",
  ];
  return commands.join(" && ");
};
