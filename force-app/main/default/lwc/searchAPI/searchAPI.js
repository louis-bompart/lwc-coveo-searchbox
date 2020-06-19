/**
 * Get suggestions from Query Expression
 * @param {string} q query expression
 */
export async function getSuggestion(q) {
    return new Promise((resolve, reject) => {
        var data = `searchHub=coveoLightningInsightPanel&q=${q}`;

        var xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                resolve(JSON.parse(this.responseText));
            }
        });

        xhr.open("POST", "https://platform.cloud.coveo.com/rest/search/v2/querySuggest?organizationId=searchuisamples");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Authorization", "Bearer accessToken");
        xhr.send(data);
    })
}

/**
 * Get results from Query Expression
 * @param {string} q query expression
 */
export async function executeQuery(q) {
    return new Promise((resolve, reject) => {

        var data = JSON.stringify({ "q": q, "searchHub": "coveoLightningInsightPanel", "numberOfResult": 5 });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                resolve(JSON.parse(this.responseText));
            }
        });

        xhr.open("POST", "https://platform.cloud.coveo.com/rest/search/v2/?organizationId=searchuisamples");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Authorization", "Bearer  accessToken");
        xhr.send(data);
    });
}
