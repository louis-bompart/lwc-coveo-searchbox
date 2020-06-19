import { LightningElement } from 'lwc';

export default class MyApp extends LightningElement {
    queryResult = '';
    handleNewQuery(event) {
        this.queryResult = JSON.stringify(event.detail);
    }
}