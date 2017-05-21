/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ph.gov.naga.etracs.service;

import java.util.List;
import ph.gov.naga.etracs.domain.Payment;

/**
 *
 * @author Drei
 */
public interface PaymentService {
    
    Payment findPaymentByReceiptNumber (String recieptno);
    List<Payment> queryPaymentByReceiptNumber (String recieptno);
    
}
