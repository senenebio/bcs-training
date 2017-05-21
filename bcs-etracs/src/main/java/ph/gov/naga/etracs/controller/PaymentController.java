/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ph.gov.naga.etracs.controller;


import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ph.gov.naga.etracs.domain.Payment;
import ph.gov.naga.etracs.service.PaymentService;

/**
 *
 * @author Drei
 */
@RestController
@CrossOrigin
@RequestMapping("/public/api/payment")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private PaymentService paymentService;

    @RequestMapping(value = "/findPaymentByReceiptNumber/{receiptno}")
    public ResponseEntity<?> findPaymentByReceiptNumber(@PathVariable String receiptno) {
        Payment payment = paymentService.findPaymentByReceiptNumber(receiptno);
        if (payment == null) {
            logger.warn("Receipt number {}, not found!", receiptno);
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity(payment, HttpStatus.OK);
    }
    
    @RequestMapping(value = "/queryPaymentByReceiptNumber/{receiptno}")
    public ResponseEntity<?> queryPaymentByReceiptNumber(@PathVariable String receiptno) {
        List<Payment> payments = paymentService.queryPaymentByReceiptNumber(receiptno);
        if (payments == null || payments.isEmpty()) {
            logger.debug("Receipt number {}, not found!", receiptno);
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity(payments, HttpStatus.OK);
    }
}
