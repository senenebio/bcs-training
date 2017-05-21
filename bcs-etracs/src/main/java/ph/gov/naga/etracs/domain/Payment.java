/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ph.gov.naga.etracs.domain;

import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import lombok.NonNull;
import ph.gov.naga.etracs.model.CashReceipt;
import ph.gov.naga.etracs.model.CashReceiptItem;
import ph.gov.naga.etracs.model.CashReceiptNonCashPayment;

/**
 *
 * @author Drei
 */
@Data
public class Payment {
    
    @NonNull
    private CashReceipt cashReceipt;
    @NonNull
    private List<CashReceiptItem> cashReceiptItems;
    @NonNull
    private List<CashReceiptNonCashPayment> cashReceiptNonCashPayments;
    
    public Payment () {
        cashReceipt = new CashReceipt();
        cashReceiptItems = new ArrayList<>();
        cashReceiptNonCashPayments = new ArrayList<> ();
    }
    
    public Payment (@NonNull CashReceipt cashReceipt,
            @NonNull List<CashReceiptItem> cashReceiptItems,
            @NonNull List<CashReceiptNonCashPayment> cashReceiptNonCashPayments) {
        
        this.cashReceipt = cashReceipt;
        this.cashReceiptItems = cashReceiptItems;        
        this.cashReceiptNonCashPayments = cashReceiptNonCashPayments;
    }
    
}
