(function bookmarletToImportLocalState() {
	function importLocalState() {
		const input = document.createElement('input');
		input.type = 'file';
		input.addEventListener('change', startImporting);
		input.click();

		function startImporting() {
			if (input.files.length !== 1) {
				return;
			}
			const reader = new FileReader();
			reader.onload = loadTextFile;
			reader.readAsText(input.files[0]);

			function loadTextFile() {
				const text = reader.result;
				let json;
				try {
					json = JSON.parse(text);
				} catch (err) {
					window.alert('Must be a JSON file!');
				}
				if (json) {
					applyStateToLocal(json);
				}
			}
		}

		function applyStateToLocal(json) {
			if (
				typeof json.datetime !== 'string' ||
				typeof json.url !== 'string' ||
				typeof json.localStorage !== 'object'
			) {
				window.alert('Invalid file format!');
				return;
			}

			if (!json.url.includes(window.location.host)) {
				const [, , instance] = json.url.split('/');
				window.alert(
					`Unable to import state because this isn't the correct NTBL instance!\n\nPlease go to the instance ${instance} and try again.`
				);
				return;
			}

			const importedStore = Object.keys(json.localStorage).map((key) => ({
				key,
				value: json.localStorage[key],
			}));

			window.localStorage.clear();
			importedStore.forEach((item) => {
				window.localStorage.setItem(item.key, item.value);
			});
			window.alert(
				`State imported successfully!\n\nYou will be redirected to the route ${json.url}\n\nPress OK to continue.`
			);
			window.location.replace(json.url);
		}
	}

	importLocalState();
})();
