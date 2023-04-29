const bitBucketApiEndPoint = process.env.REACT_APP_BUTBUCKET_API_ENDPOINT;

export const createPRWithAuth = async ({
  targetBranch,
  token,
  title,
  description,
}) => {
  const pullRequestData = {
    title: title,
    description: description,
    source: {
      branch: {
        name: targetBranch,
      },
    },
  };

  const fetchOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pullRequestData),
  };
  fetch(bitBucketApiEndPoint + "/pullrequests", fetchOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("Pull request created successfully:", response);
    })
    .catch((error) => {
      console.error("Error creating pull request:", error);
    });
};

// More info here
// https://developer.atlassian.com/cloud/bitbucket/rest/api-group-refs/#api-repositories-workspace-repo-slug-refs-branches-post
export const createBranchWithAuth = async ({name, token}) => {
  const newBranchRequestData = {
    name: name,
    target: {
      hash: "master",
    },
  };

  const fetchOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newBranchRequestData),
  };
  fetch(bitBucketApiEndPoint + "/refs/branches", fetchOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("A new branch was created successfully:", response);
    })
    .catch((error) => {
      console.error("Error creating a new branch:", error);
    });
};
