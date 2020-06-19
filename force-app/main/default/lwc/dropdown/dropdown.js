import { LightningElement, api } from 'lwc';

export default class Dropdown extends LightningElement {
    _isOpen = false;
    @api get isOpen() {
        return this._isOpen;
    }
    @api closeDropdown() {
        this._isOpen = false;
    }
    @api openDropdown() {
        this._isOpen = true;
    }
}