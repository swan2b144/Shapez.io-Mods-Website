const quote = "'";
const esQuote = "`";
const doubleQuote = '"';
const regexQuote = /'/g;
const regexEsQuote = /`/g;
const regexDoubleQuote = /"/g;

function showFromString(parent, string) {
    var template = document.createElement("template");
    template.innerHTML = string;
    for (let i = 0; i < template.content.childNodes.length; i++) {
        const node = template.content.childNodes[i];
        parent.append(node);
    }
}

function showFromStringAfter(sibling, string) {
    var template = document.createElement("template");
    template.innerHTML = string;
    for (let i = 0; i < template.content.childNodes.length; i++) {
        const node = template.content.childNodes[i];
        sibling.parentNode.insertBefore(node, sibling.nextSibling);
    }
}

function makeid(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

class Dialog {
    constructor(title, description, canCancel = false, trackClicksOk = [], trackClicksCancel = []) {
        this.title = title;
        this.description = description;
        this.canCancel = canCancel;
        this.id = `dialog-${makeid(10)}`;
        this.trackClicksOk = trackClicksOk;
        this.trackClicksCancel = trackClicksCancel;
    }

    show(parent) {
        showFromString(parent, this.getHtml());
    }

    getHtml() {
            return `<div class="dialog" id="${this.id}">
        <div class="dialog-background">
            <div class="title">${this.title}</div>
            <div class="description">${this.description}</div>
            ${this.getInnerHTML()}
            <div class="buttons">
                ${this.canCancel ? `<a onclick="${this.getCancelTrackClicks()} document.getElementById('${this.id}').remove()" class="cancel">Cancel</a>` : ""}
                <a onclick="${this.getOkTrackClicks()} document.getElementById('${this.id}').remove();" class="ok">Ok</a>
            </div>
        </div>
    </div>`;
	}

	getOkTrackClicks() {
		return this.trackClicksOk.join(" ").replace(regexDoubleQuote, "`");
	}

	getCancelTrackClicks() {
		return this.trackClicksCancel.join(" ").replace(regexDoubleQuote, "`");
	}

	getInnerHTML() {
		return ``;
	}
}

let checkSelect = (self, options, onChange) => {
	if (!self.parentElement.parentElement.getElementsByClassName("active")[0]) {
		if (!self.parentElement.parentElement.getElementsByClassName("options")[0].nextElementSibling.classList.contains("options-error")) showFromStringAfter(self.parentElement.parentElement.getElementsByClassName("options")[0], "<div class=options-error>Choose one instance</div>");
		return;
	}
	let value = self.parentElement.parentElement.getElementsByClassName("active")[0].getAttribute("value");
	onChange(`{${esQuote}instances${esQuote}:[${options}]}`, value);
};

class SelectDialog extends Dialog {
	constructor(title, description, options, getText, change = () => {}, canCancel = true) {
		super(title, description, canCancel, [`if(checkSelect(this, \`${options.join(",")}\`, ${change})) return;`]);
		this.options = options;
		this.getText = getText;
	}

	getInnerHTML() {
		return `<div class="options">
        ${this.options.map((option) => `<div onclick="[...this.parentElement.getElementsByClassName('active')].forEach(element => element.classList.remove('active')); this.classList.add('active')" value="${option}" class="option">${this.getText(option)}</div>`).join("")}
    </div>
    `;
	}
}