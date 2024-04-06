document.addEventListener('DOMContentLoaded', function() {
    const serverIP = '10.0.0.64';
    const baseURL = `https://${serverIP}`;

    document.getElementById('app-home').onclick = function() {
        window.location.href = '/';
    };

    document.getElementById('roku-home').onclick = function() {
        sendRokuCommand('keypress/Home');
    };

    document.getElementById('search-button').onclick = function() {
        const searchQuery = document.getElementById('search-input').value;
        console.log(searchQuery);
        sendRokuCommand(`search/browse?keyword=${encodeURIComponent(searchQuery)}`, "GET");
    };

    document.getElementById('launch-app').onclick = function() {
        const appId = document.getElementById('app-list').value;
        sendRokuCommand(`launch/${appId}`);
    };

    document.querySelectorAll('.btn').forEach(button => {
        console.log("button event listener set");
        button.addEventListener('click', function() {
            const command = (this.id !== "ok" ? this.id : "Select"); // Use button ID as command for simplicity
            console.log(command);
            sendRokuCommand("keypress/"+command); // Implement this function based on your server's API
        });
    });

    // function sendRokuCommand(command) {
    //     fetch(baseURL + command, { method: 'POST' })
    //         .then(response => console.log(response.status))
    //         .catch(error => console.error('Error:', error));
    // }

    // function sendRokuCommand(command, m = "POST") {
    //     console.log(`sending command ${command} to ${serverIP}`);
    //     fetch(`https://${serverIP}/rokuRemote`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ command }),
    //     })
    //     .then(response => response.json())
    //     .then(data => console.log(data))
    //     .catch(error => console.error('Error:', error));
    // }

    function sendRokuCommand(command, m = "POST") {
        console.log(`sending command ${command} to ${serverIP}`);
        const fetchOptions = {
            method: m,
            headers: {
                'Content-Type': 'application/json',
            },
        };
    
        if(m === "POST") {
            fetchOptions.body = JSON.stringify({ command });
        }
    
        fetch(`https://${serverIP}/rokuRemote`, fetchOptions)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }    

    // // Example function to populate the app list - replace with actual Roku API call if available
    // function populateAppList() {
    //     fetch(`https://${serverIP}:8060/query/apps`)
    //         .then(response => response.text())
    //         .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
    //         .then(data => {
    //             const apps = data.querySelectorAll('app');
    //             const appList = document.getElementById('app-list');
    //             apps.forEach(app => {
    //                 let option = document.createElement('option');
    //                 option.value = app.getAttribute('id');
    //                 option.textContent = app.textContent;
    //                 appList.appendChild(option);
    //             });
    //         })
    //         .catch(error => console.error('Error:', error));
    // }

    function populateAppList() {
        fetch(`https://${serverIP}/rokuRemote/populateAppList`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            const appList = document.getElementById('app-list');
            data.apps.forEach(app => {
                let option = document.createElement('option');
                option.value = app.id;
                option.textContent = app.name;
                appList.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));
    }
    

    populateAppList(); // Call this function to populate the dropdown with available apps
});
