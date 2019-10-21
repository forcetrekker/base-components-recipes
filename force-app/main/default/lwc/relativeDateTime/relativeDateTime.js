import { LightningElement, track, api } from 'lwc';
import { assert } from 'c/utilsPrivate';
import { getFormattedRelativeDate, getTimeoutUnitsTillInvalid } from './utils';

export default class cRelativeDateTime extends LightningElement {
    @track formattedValue = '';
    set value(next) {
        this.privateValue = next;
        this.updateFormattedValue();
    }

    @api get value() {
        return this.privateValue;
    }
    privateValue;

    connectedCallback() {
        if (!this.updateFormattedValue()) {
            this.scheduleFormattedValueUpdate();
        }
    }

    disconnectedCallback() {
        this.cancelScheduledFormattedValueUpdate();
    }

    renderedCallback() {
        this.scheduleFormattedValueUpdate();
    }

    updateFormattedValue() {
        const oldFormattedValue = this.formattedValue;

        try {
            this.formattedValue = getFormattedRelativeDate(this.value);
        } catch (e) {
            const errorMessage =
                `<lightning-relative-date-time>: Error while formatting ` +
                `"${this.value}": ${e.message}`;

            assert(false, errorMessage);
            this.formattedValue = '';
        }

        return oldFormattedValue !== this.formattedValue;
    }

    scheduleFormattedValueUpdate() {
        this.cancelScheduledFormattedValueUpdate();
        if (this.formattedValue !== '') {
            const units = getTimeoutUnitsTillInvalid(this.value);

            this.formattedValueUpdateTask = setTimeout(
                this.updateFormattedValue.bind(this),
                units
            );
        }
    }

    cancelScheduledFormattedValueUpdate() {
        clearTimeout(this.formattedValueUpdateTask);
    }
}
