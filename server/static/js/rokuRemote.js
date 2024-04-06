document.addEventListener('DOMContentLoaded', function() {
    const rokuIP = '$ROKU_IP$';
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
        const apps = [{id: '12', name: 'Netflix'}, {id: '13', name: 'Hulu'}]; // Example data
        const appList = document.getElementById('app-list');
        apps.forEach(app => {
            let option = document.createElement('option');
            option.value = app.id;
            option.textContent = app.name;
            appList.appendChild(option);
        });
    }

    populateAppList(); // Call this function to populate the dropdown with available apps
});
