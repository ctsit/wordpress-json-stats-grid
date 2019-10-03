function displayStats(root, stats) {
    console.log(Object.keys(stats));

    Object.keys(stats).forEach(function(key) {
            document.getElementById(key).prepend(`${stats[key]} `);
            });
}
function rcmetrics(endpoint) {
    const root = document.getElementById("rcmetrics");
        fetch(endpoint)
        .then(function (resp) {
                return resp.json()
                })
    .then(function (stats) {
            if (!stats.success || !stats.data || stats.data.length !== 1) {
            root.remove()
            return
            }
            displayStats(root, stats.data[0])
            })
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('import worked');
    const endpoint = document.getElementById('expose-endpoint-hack').textContent;
    console.log(endpoint);
    rcmetrics(endpoint);
});
