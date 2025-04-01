async function FillLatestForgejoRelease() {
    const itemStartTime = performance.now(); // Timing for each item

    const apiPath = `https://forgejo-proxy.services-prod.lila.network/api/v1/code.lila.network/releases`
    var forgejoItems = document.getElementsByClassName('forgejo-version')

    const requestOptions = {
        method: "GET",
        redirect: "follow",
        
    };

    [...forgejoItems].forEach(async item => {
        var repo = item.getAttribute("data-forgejo-repo");

        var queryParam = new URLSearchParams({ namespace: repo }).toString()


        var response = await fetch(`${apiPath}?${queryParam}`, requestOptions)

        if (response.ok) {
            item.textContent = await response.text()
        } else {
            item.textContent = "currently unavailable"
        }
        const itemEndTime = performance.now(); // End timing for this item
        console.log(`[Forgejo] Release version processing time for ${repo}: ${itemEndTime - itemStartTime}ms`);
    });
}

async function FillLatestGitlabRelease() {
    var apiPath = `https://URI/api/v4/projects/ID/releases/permalink/latest?order_by=semver`
    var gitlabItems = document.getElementsByClassName('gitlab-version')

    const requestOptions = {
        method: "GET",
        redirect: "follow",
        
    };

    [...gitlabItems].forEach(async item => {
        const itemStartTime = performance.now(); // Timing for each item
        var repoLink = item.getAttribute("data-gitlab-repo");

        var repoArray = repoLink.split("/")

        apiPath = apiPath.replace("URI", encodeURIComponent(repoArray[0]))
        apiPath = apiPath.replace("ID", encodeURIComponent(repoArray.slice(1).join("/")))

        var response = await fetch(`${apiPath}`, requestOptions)

        const data = await response.json()


        if (response.ok) {
            item.textContent = data.tag_name
        } else {
            item.textContent = "currently unavailable"
        }
        const itemEndTime = performance.now(); // End timing for this item
        console.log(`[GitLab] Release version processing time for ${repoLink}: ${itemEndTime - itemStartTime}ms`);
    });
}

FillLatestGitlabRelease()
FillLatestForgejoRelease()
