import { css, CSSResult, customElement, html, LitElement, property, TemplateResult } from "lit-element";
import PFBase from "@patternfly/patternfly/patternfly-base.css";
import PFButton from "@patternfly/patternfly/components/Button/button.css";
import PFModalBox from "@patternfly/patternfly/components/ModalBox/modal-box.css";
import PFForm from "@patternfly/patternfly/components/Form/form.css";
import PFFormControl from "@patternfly/patternfly/components/FormControl/form-control.css";
import PFBullseye from "@patternfly/patternfly/layouts/Bullseye/bullseye.css";
import PFBackdrop from "@patternfly/patternfly/components/Backdrop/backdrop.css";
import PFPage from "@patternfly/patternfly/components/Page/page.css";
import PFStack from "@patternfly/patternfly/layouts/Stack/stack.css";
import PFCard from "@patternfly/patternfly/components/Card/card.css";
import PFContent from "@patternfly/patternfly/components/Content/content.css";
import AKGlobal from "../../authentik.css";
import { PFSize } from "../Spinner";

export const MODAL_BUTTON_STYLES = css`
    :host {
        text-align: left;
        font-size: var(--pf-global--FontSize--md);
    }
    .pf-c-modal-box.pf-m-lg {
        overflow-y: auto;
    }
    .pf-c-modal-box > .pf-c-button + * {
        margin-right: 0;
    }
    /* fix multiple selects height */
    select[multiple] {
        height: 15em;
    }
`;

@customElement("ak-modal-button")
export class ModalButton extends LitElement {
    @property()
    size: PFSize = PFSize.Large;

    @property({type: Boolean})
    open = false;

    static get styles(): CSSResult[] {
        return [PFBase, PFButton, PFModalBox, PFForm, PFFormControl, PFBullseye, PFBackdrop, PFPage, PFStack, PFCard, PFContent, AKGlobal, MODAL_BUTTON_STYLES];
    }

    constructor() {
        super();
        window.addEventListener("keyup", (e) => {
            if (e.code === "Escape") {
                this.resetForms();
                this.open = false;
            }
        });
    }

    resetForms(): void {
        this.querySelectorAll<HTMLFormElement>("[slot=form]").forEach(form => {
            form.reset();
        });
    }

    onClick(): void {
        this.open = true;
        this.querySelectorAll("*").forEach(child => {
            if ("requestUpdate" in child) {
                (child as LitElement).requestUpdate();
            }
        });
    }

    renderModalInner(): TemplateResult {
        return html`<slot name='modal'></slot>`;
    }

    renderModal(): TemplateResult {
        return html`<div class="pf-c-backdrop">
            <div class="pf-l-bullseye">
                <div
                    class="pf-c-modal-box ${this.size}"
                    role="dialog"
                    aria-modal="true"
                >
                    <button
                        @click=${() => (this.open = false)}
                        class="pf-c-button pf-m-plain"
                        type="button"
                        aria-label="Close dialog"
                    >
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                    ${this.renderModalInner()}
                </div>
            </div>
        </div>`;
    }

    render(): TemplateResult {
        return html` <slot name="trigger" @click=${() => this.onClick()}></slot>
            ${this.open ? this.renderModal() : ""}`;
    }

}
