/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ph.gov.naga.service;

import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ph.gov.naga.domain.BusPaymentData;
import ph.gov.naga.model.TerminalPass;

/**
 *
 * @author Drei
 */
@Service
public class BusPaymentServiceImpl implements BusPaymentService {

    private static final Logger logger = LoggerFactory.getLogger(BusPaymentServiceImpl.class);

    @Autowired
    private TerminalPassService terminalPassService;

    @Override
    public List<BusPaymentData> findAllForPayment() {
        logger.info("Find all Bus Pyament data.");

        List<BusPaymentData> result = new ArrayList<>();

        List<TerminalPass> forPayment = terminalPassService.findVehiclesInsideTerminal();
        //undeparted and those that are eligible for payment

        for (TerminalPass tp : forPayment) {
            if (tp.getStatus().compareToIgnoreCase("ASSESSED") == 0
                    || tp.getStatus().compareToIgnoreCase("PAID") == 0
                    || tp.getStatus().compareToIgnoreCase("APPROVED") == 0) {
                result.add(new BusPaymentData(tp));
            }

        }
        return result;
    }

    @Override
    public BusPaymentData findBusPaymentByReceiptno(String receiptno) {
        logger.info("Finding Bus Payment data with OR {}", receiptno);

        List<BusPaymentData> forPayment = this.findAllForPayment();
        for (BusPaymentData bp : forPayment) {
            if (bp.getTerminalPass().getReceiptNumber().compareTo(receiptno) == 0) {
                logger.info("Found Terminal Pass {}", bp);
                return bp;
            } else {
                logger.warn("Terminal Pass with OR {}, not found!", receiptno);
            }
        }
        return null;
    }

    @Override
    public BusPaymentData findBusPaymentById(Long id) {
        logger.info("Finding Terminal Pass with id {}", id);
        List<BusPaymentData> forPayment = this.findAllForPayment();
        for (BusPaymentData bp : forPayment) {
            if (bp.getTerminalPass().getId().compareTo(id) == 0) {
                logger.info("Found Terminal Pass {}", bp);
                return bp;
            } else {
                logger.warn("Terminal Pass with id {}, not found!", id);
            }
        }
        return null;
    }

}
