(function bookmarletToExportLocalState() {
	function exportLocalState() {
		const datetime = new Date().toISOString();
		const payload = {
			datetime,
			url: window.location.href,
			localStorage: window.localStorage,
		};
		const json = JSON.stringify(payload, null, 2);
		const dataUri = `data:text/json,${json}`;
		const filename = `NTBL_LocalState_${datetime}.json`;
		const link = document.createElement('a');
		link.download = filename;
		link.href = dataUri;
		link.click();
		window.alert('State exported successfully!\n\nYou can now share this file with the team.');
	}

	exportLocalState();
})();
