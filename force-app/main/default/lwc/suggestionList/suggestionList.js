import { LightningElement, api } from 'lwc';
import Suggestion from 'c/suggestion';

//#region TypeDefinitions

/**
 * @typedef SuggestionData
 * @type {object}
 * @property {string} id - ID of the page.
 * @property {string} title - Main text of the suggestion.
 * @property {string} description - Sub-text of the suggestion.
 * @property {string} iconUrl - ID of the page.
 */

//#endregion

export default class SuggestionList extends LightningElement {
    /**
     * @type {SuggestionData[]}
     */
    @api suggestions;


    @api focusSuggestion(index) {
        this.updateFocusedSuggestion(this.suggestionComponents[index]);
    }
    /**
     * Just a cache of the Suggestion components.
     * @type {Suggestion[]}
     */
    _suggestionComponents;

    get suggestionComponents() {
        if (this._suggestionComponents.length === 0) {
            this._suggestionComponents = Array.from(this.template.querySelectorAll('c-suggestion'));
        }
        return this._suggestionComponents;
    }

    clearSuggestionComponents() {
        this._suggestionComponents = []
    }
    /**
     * 
     * @param {MouseEvent} event 
     */
    // eslint-disable-next-line no-unused-vars
    handleSuggestionMouseEnter(event) {
        /**
         * @type {Suggestion}
         */
        const suggestion = event.target;
        this.updateFocusedSuggestion(suggestion)
    }

    /**
     * @type {Suggestion}
     */
    focusedSuggestion;


    getSuggestionFromIndex(suggestionIndex) {
        return this.suggestionComponents.find(suggestion => suggestion.suggestionId === this.suggestions[suggestionIndex].id);
    }

    /**
     * 
     * @param {Suggestion} suggestion 
     */
    updateFocusedSuggestion(suggestion) {
        if (this.focusedSuggestion) {

            if (this.focusedSuggestion === suggestion) {
                return;
            }
            this.focusedSuggestion.unfocusSuggestion();
        }
        suggestion.focusSuggestion();
        this.focusedSuggestion = suggestion;
    }

    /**
     * 
     * @param {MouseEvent} event 
     */
    // eslint-disable-next-line no-unused-vars
    handleSuggestionClick(event) {
        this.updateFocusedSuggestion(event.target);
        this.selectSuggestion();
    }

    getCurrentSuggestionIndex() {
        return this.suggestionComponents.findIndex(suggestion => suggestion === this.focusedSuggestion);
    }

    handleArrowUp() {
        const currentIndex = this.getCurrentSuggestionIndex();
        if (currentIndex < 0) {
            this.updateFocusedSuggestion(this.getSuggestionFromIndex(this.suggestions.length - 1));
            return;
        }
        this.updateFocusedSuggestion(this.getSuggestionFromIndex(currentIndex === 0 ? this.suggestions.length - 1 : currentIndex - 1));
    }

    handleArrowDown() {
        const currentIndex = this.getCurrentSuggestionIndex();
        if (currentIndex < 0) {
            this.updateFocusedSuggestion(this.getSuggestionFromIndex(0));
            return;
        }
        this.updateFocusedSuggestion(this.getSuggestionFromIndex(currentIndex === this.suggestions.length - 1 ? 0 : currentIndex + 1));
    }

    handleEnter() {
        this.selectSuggestion();
    }

    selectSuggestion() {
        const suggestionSelected = new CustomEvent('suggestionselected', {
            detail: { suggestion: this.focusedSuggestion }
        });
        this.dispatchEvent(suggestionSelected);
    }

    /**
     * Handle the keyboard event,
     * @param {KeyboardEvent} event
     */
    @api handleKeyDownEvent(event) {
        switch (event.key) {
            case "Down":
            case "ArrowDown":
                this.handleArrowDown();
                break;
            case "Up":
            case "ArrowUp":
                this.handleArrowUp();
                break;
            case "Enter":
                this.handleEnter();
                break;
            default:
                break;
        }
    }

    renderedCallback() {
        this.clearSuggestionComponents();
    }
}