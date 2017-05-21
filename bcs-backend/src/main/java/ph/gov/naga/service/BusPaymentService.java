/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ph.gov.naga.service;

import java.util.List;
import ph.gov.naga.domain.BusPaymentData;

/**
 *
 * @author Drei
 */
public interface BusPaymentService {

    List<BusPaymentData> findAllForPayment();

    BusPaymentData findBusPaymentByReceiptno(String receiptno);

    BusPaymentData findBusPaymentById(Long id);
}
