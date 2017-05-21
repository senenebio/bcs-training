/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ph.gov.naga.domain;

import lombok.Data;
import lombok.NonNull;
import ph.gov.naga.model.TerminalPass;

/**
 *
 * @author Drei
 */
@Data
public class BusPaymentData {

    @NonNull
    private TerminalPass terminalPass;

    public BusPaymentData() {
        this.terminalPass = new TerminalPass();
    }

    public BusPaymentData(@NonNull TerminalPass terminalPass) {
        this.terminalPass = terminalPass;

    }

    public boolean isValid() {
        boolean result = this.terminalPass != null
                && this.terminalPass.getReceiptNumber() != null
                && !this.terminalPass.getReceiptNumber().isEmpty()
                && this.terminalPass.getCollectedBy() != null
                && !this.terminalPass.getCollectedBy().isEmpty()
                && this.terminalPass.getCollectedTime() != null;
        return result;
    }

}
