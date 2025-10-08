function displayStats( root, stats ) {
	Object.keys(stats).forEach(function(key) {
			try {
				document.getElementById(key).prepend(`${stats[key]} `);
			} catch(e) {
			// Key not present, do nothing
			}
		});
}
function rcmetrics( endpoint ) {
	const root = document.getElementById("rcmetrics");
		fetch(endpoint)
		.then(function (resp) {
				return resp.json();
				})
	.then(function (stats) {
			if (!stats.success || !stats.data || stats.data.length !== 1) {
				root.remove();
				return;
			}
			displayStats(root, stats.data[0]);
		});
}

document.addEventListener("DOMContentLoaded", function(event) {
	try {
		const endpoint = document.getElementById('expose-endpoint-hack').textContent;
		if (endpoint) {
			rcmetrics(endpoint);
		}
	} catch(err) {
		// TypeErrors due to element not existing 
	}
});
