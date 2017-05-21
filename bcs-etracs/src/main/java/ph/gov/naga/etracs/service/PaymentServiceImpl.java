/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ph.gov.naga.etracs.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import ph.gov.naga.etracs.domain.Payment;
import ph.gov.naga.etracs.model.CashReceipt;
import ph.gov.naga.etracs.model.CashReceiptItem;
import ph.gov.naga.etracs.model.CashReceiptNonCashPayment;
import ph.gov.naga.etracs.repository.CashReceiptItemRepository;
import ph.gov.naga.etracs.repository.CashReceiptNonCashPaymentRepository;
import ph.gov.naga.etracs.repository.CashReceiptRepository;

/**
 *
 * @author Drei
 */
@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private CashReceiptRepository cashReceiptRepository;

    @Autowired
    private CashReceiptItemRepository cashReceiptItemRepository;

    @Autowired
    private CashReceiptNonCashPaymentRepository cashReceiptNonCashPaymentRepository;

    @Override
    public Payment findPaymentByReceiptNumber(String recieptno) {

        CashReceipt cashreceipt = cashReceiptRepository.findByReceiptno(recieptno);
        if (cashreceipt != null) {
            Payment payment = new Payment();
            payment.setCashReceipt(cashreceipt);

            String objid = cashreceipt.getObjid();

            List<CashReceiptItem> cashReceiptItems = cashReceiptItemRepository.findByReceiptid(objid);
            if (cashReceiptItems != null && !cashReceiptItems.isEmpty()) {
                payment.setCashReceiptItems(cashReceiptItems);
            }

            List<CashReceiptNonCashPayment> cashReceiptNonCashPayments = cashReceiptNonCashPaymentRepository.findByReceiptid(objid);
            if (cashReceiptNonCashPayments != null && !cashReceiptNonCashPayments.isEmpty()) {
                payment.setCashReceiptNonCashPayments(cashReceiptNonCashPayments);
            }
            return payment;
        }
        return null;
    }

    @Override
    public List<Payment> queryPaymentByReceiptNumber(String recieptno) {
        List<Payment> result = new ArrayList<>();
        List<CashReceipt> cashreceipts;
        cashreceipts = cashReceiptRepository.
                findByReceiptnoContaining(recieptno);

        if (cashreceipts != null && !cashreceipts.isEmpty()) {
            for (CashReceipt cashreceipt : cashreceipts) {
                //no cash tickets, only Form 51
                if (cashreceipt.getFormno().equalsIgnoreCase("51")) {
                    Payment payment = new Payment();
                    payment.setCashReceipt(cashreceipt);

                    String objid = cashreceipt.getObjid();

                    List<CashReceiptItem> cashReceiptItems = cashReceiptItemRepository.findByReceiptid(objid);
                    if (cashReceiptItems != null && !cashReceiptItems.isEmpty()) {
                        payment.setCashReceiptItems(cashReceiptItems);
                    }

                    List<CashReceiptNonCashPayment> cashReceiptNonCashPayments = cashReceiptNonCashPaymentRepository.findByReceiptid(objid);
                    if (cashReceiptNonCashPayments != null && !cashReceiptNonCashPayments.isEmpty()) {
                        payment.setCashReceiptNonCashPayments(cashReceiptNonCashPayments);
                    }

                    //add to selection list
                    result.add(payment);
                }
            }
        }
        return result;
    }

}
