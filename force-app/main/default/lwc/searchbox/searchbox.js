import { LightningElement } from 'lwc';
import SVG_EXAMPLE from "@salesforce/resourceUrl/myIcons";
import { getSuggestion, executeQuery } from 'c/searchAPI';
// eslint-disable-next-line no-unused-vars
import Suggestion from 'c/suggestion';
import Dropdown from 'c/dropdown';

export default class Searchbox extends LightningElement {
    suggestions = [];
    queryLoading = false;

    /**
     * Update the suggestions using the SearchAPI QuerySuggest.
     * @param {string} q the expression to use for querySuggest
     */
    async updateSuggestions(q) {
        const rawSuggestions = await getSuggestion(q);
        let id = 0;
        const newSuggestions = []
        if (q) {
            newSuggestions.push({ id: id++, title: `"${q}"`, iconUrl: 'utility:search' })
        }
        rawSuggestions.completions.forEach(suggestion => {
            newSuggestions.push({ id: id++, title: suggestion.expression, iconUrl: `${SVG_EXAMPLE}/someIcon.svg#aperture` })
        });
        this.suggestions = newSuggestions;

    }

    /**
     * Route-back the KeyboardEvent of the lightning-input to the suggestionList.
     * He'll sort them out.
     * @param {KeyboardEvent} event 
     */
    handleKeydown(event) {
        const suggestionList = this.template.querySelector('c-suggestion-list');
        switch (event.key) {
            case 'Esc':
            case 'Escape':
                this.handleEscape(event);
                break;
            default:
                suggestionList.handleKeyDownEvent(event)
                break;
        }
    }

    /**
     * 
     * @param {KeyboardEvent} event 
     */
    handleEscape(event) {
        event.preventDefault();
        /**
         * @type {Dropdown}
         */
        const dropdown = this.template.querySelector('c-dropdown');
        if (dropdown.isOpen) {
            dropdown.closeDropdown();
        } else {
            this.template.querySelector('lightning-input').blur();
        }
    }

    /**
     * If the user click in the suggestion, we prevent the default behavior to avoid the bluring and closing of the dropdown too early.
     * We instead manage that in the handleSuggestionSelected.
     * @param {Event} event 
     */
    handleClickOnSuggestionList(event) {
        event.preventDefault();
    }

    /**
     * Handle the user typing in the lightning-input by updating the suggestion and focusing the first one.
     * @param {InputEvent} event 
     */
    async handleInput(event) {
        // eslint-disable-next-line no-debugger
        await this.updateSuggestions(event.detail.value);
        this.template.querySelector('c-suggestion-list').focusSuggestion(0);
    }

    /**
     * Handle the focus of the lightning-input by opening the dropdown and updating the suggestions.
     */
    async handleFocus() {
        this.template.querySelector('c-dropdown').openDropdown();
        await this.updateSuggestions(this.template.querySelector('lightning-input').value);
    }

    /**
     * Handle the selection of a suggestion by triggering a query.
     * Query are only triggered by suggestion selection.
     * @param {CustomEvent} event 
     */
    async handleSuggestionSelected(event) {
        // Inform the lightning-input a search is ongoing.
        this.queryLoading = true;

        // Close the dropdown, we don't need it anymore.
        this.template.querySelector('c-dropdown').closeDropdown();
        // Do the actual query!
        /**
         * @type {Suggestion}
         */
        const suggestion = event.detail;
        const queryResult = await executeQuery(suggestion.title);
        const newQuery = new CustomEvent('newquery', {
            detail: queryResult
        });
        // Query resolved: inform owner, inform lightning-input that no query are ongoing and unfocus it.
        this.dispatchEvent(newQuery);
        this.queryLoading = false;
        this.template.querySelector('lightning-input').blur();
    }

    /**
     * When the user click out of the lightning-input, close the dropdown* @see {handleClickOnSuggestionList} tho.
     */
    handleBlur() {
        this.template.querySelector('c-dropdown').closeDropdown();
    }
}