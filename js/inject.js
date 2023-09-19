const isFirefox = navigator.userAgent.includes("Firefox");
const storage = (isFirefox ? browser : chrome).storage.sync;

const defaultSettings = {
    key: "value"
};

function replaceText(text, settings) {
    for (const key in settings) {
        const value = settings[key];
        const regex = new RegExp(key, 'g');
        text = text.replace(regex, value);
    }
    return text;
}

const changedNodes = new Set();

function shouldProcessNode(node) {
    const { tagName, parentNode } = node;
    const isScriptOrStyleTag = tagName === "SCRIPT" || tagName === "STYLE";
    const isParentScriptOrStyleTag = parentNode.tagName === "SCRIPT" || parentNode.tagName === "STYLE";
    const isSlateStringSpan = parentNode.tagName === "SPAN" && parentNode.dataset && parentNode.dataset.slateString;

    return (
        !changedNodes.has(node) &&
        node !== document.body &&
        node.nodeValue !== null &&
        node.nodeValue.trim() !== "" &&
        !isScriptOrStyleTag &&
        !isParentScriptOrStyleTag &&
        !isSlateStringSpan
    );
}

function processNode(node, settings) {
    if (shouldProcessNode(node)) {
        node.nodeValue = replaceText(node.nodeValue, settings);
        changedNodes.add(node);
    }
    node.childNodes.forEach(childNode => processNode(childNode, settings));
}

storage.get({
    enabled: false,
    settings: JSON.stringify(defaultSettings)
}, ({ enabled, settings }) => {
    setInterval(() => {
        if (enabled) {
            processNode(document.body, JSON.parse(settings));
        }
    }, 100);
});
