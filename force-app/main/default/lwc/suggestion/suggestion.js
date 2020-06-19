import { LightningElement, api } from 'lwc';
export default class Suggestion extends LightningElement {
    @api suggestionId;
    @api suggestionTitle;

    @api suggestionDescription;

    @api suggestionIconUrl;

    isFocused = false;

    suggestionBaseClass = 'slds-media slds-listbox__option slds-listbox__option_entity slds-listbox__option_has-meta';
    get suggestionClass() {
        return `${this.suggestionBaseClass}${this.isFocused ? ' slds-has-focus' : ''}`
    }

    get isSLDSIcon() {
        return /^\w*:\w*$/.test(this.suggestionIconUrl);
    }

    @api focusSuggestion() {
        if (!this.isFocused) {
            this.isFocused = true;
        }
    }

    @api unfocusSuggestion() {
        if (this.isFocused) {
            this.isFocused = false;
        }
    }
}