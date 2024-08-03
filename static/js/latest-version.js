async function FillLatestForgejoRelease() {

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
        }
    });
}


FillLatestForgejoRelease()
