document.addEventListener('DOMContentLoaded', function() {
    const rokuIP = '10.0.0.64';
    const baseURL = `https://${rokuIP}`;

    document.getElementById('app-home').onclick = function() {
        window.location.href = '/';
    };

    document.getElementById('roku-home').onclick = function() {
        sendRokuCommand('/keypress/Home');
    };

    document.getElementById('search-button').onclick = function() {
        const searchQuery = document.getElementById('search-input').value;
        sendRokuCommand(`/search/browse?keyword=${encodeURIComponent(searchQuery)}`);
    };

    document.getElementById('launch-app').onclick = function() {
        const appId = document.getElementById('app-list').value;
        sendRokuCommand(`/launch/${appId}`);
    };

    function sendRokuCommand(command) {
        fetch(baseURL + command, { method: 'POST' })
            .then(response => console.log(response.status))
            .catch(error => console.error('Error:', error));
    }

    // Example function to populate the app list - replace with actual Roku API call if available
    function populateAppList() {
        fetch(`https://${rokuIP}:8060/query/apps`)
            .then(response => response.text())
            .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
            .then(data => {
                const apps = data.querySelectorAll('app');
                const appList = document.getElementById('app-list');
                apps.forEach(app => {
                    let option = document.createElement('option');
                    option.value = app.getAttribute('id');
                    option.textContent = app.textContent;
                    appList.appendChild(option);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    populateAppList(); // Call this function to populate the dropdown with available apps
});
