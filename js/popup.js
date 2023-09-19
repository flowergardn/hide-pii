const saveButton = document.getElementById("save");
const status = document.getElementById("status");
const enabled = document.getElementById("enable");
const settingsInput = document.getElementById("settingsInput");

const storage = (navigator.userAgent.includes("Firefox") ? browser : chrome).storage.sync;

const defaultJSON = {
    "key": "value"
}

storage.get({
    enabled: false,
    settings: JSON.stringify(defaultJSON, null, 4)
}).then(({ enabled: enabledValue, settings }) => {
    enabled.checked = enabledValue;
    settingsInput.textContent = settings
});

saveButton.addEventListener("click", () => {
    const json = settingsInput.value

    try {
        JSON.parse(json)
    } catch(err) {
        status.color = "#ff697b"
        status.innerText = "Error parsing JSON content.";
        setTimeout(() => status.innerText = "", 2000);
        return
    }

    storage.set({
        enabled: enabled.checked,
        settings: json
    }, () => {
        status.innerText = "Saved successfully!";
        setTimeout(() => status.innerText = "", 2000);
    });
});
