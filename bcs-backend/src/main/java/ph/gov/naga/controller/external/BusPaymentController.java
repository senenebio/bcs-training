/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ph.gov.naga.controller.external;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;
import ph.gov.naga.domain.BusPaymentData;
import ph.gov.naga.model.TerminalPass;
import ph.gov.naga.service.BusPaymentService;
import ph.gov.naga.service.TerminalPassService;
import ph.gov.naga.utils.CustomError;

/**
 *
 * @author Drei
 */
@RestController
@CrossOrigin
@RequestMapping("/public/api/bus_payment")
public class BusPaymentController {

    private static final Logger logger = LoggerFactory.getLogger(BusPaymentController.class);

    @Autowired
    BusPaymentService busPaymentService;
    
    @Autowired
    private TerminalPassService terminalPassService;

    @RequestMapping(value = "/")
    public ResponseEntity<?> findAllForPayment() {
        logger.info("Finding Terminal Passes for Payment.");

        List<BusPaymentData> result = busPaymentService.findAllForPayment();
        if (result.isEmpty()) {
            logger.warn("No terminal pass found.");
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    
    @RequestMapping(value = "/{id}")
    ResponseEntity<?> findBusPaymentById(@PathVariable("id") Long id) {
        logger.info("Find Terminal Pass id {}", id);
        BusPaymentData bp = this.busPaymentService.findBusPaymentById(id);
        if (bp == null) {
            logger.info("Terminal pass id {} not found", id);
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
        logger.info("Found terminal pass {}", bp);
        return new ResponseEntity<>(bp, HttpStatus.OK);
    }
   
    
    @RequestMapping(value = "/findBuspaymentByReceiptno/{receiptno}")
    ResponseEntity<?> findBuspaymentByReceiptno(@PathVariable("receiptno") String receiptno) {
        logger.info("Find Terminal Pass by OR {}", receiptno);
        BusPaymentData bp = this.busPaymentService.findBusPaymentByReceiptno(receiptno);
        if (bp == null) {
            logger.info("Terminal pass with OR {} not found", receiptno);
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
        logger.info("Found terminal pass {}", bp);
        return new ResponseEntity<>(bp, HttpStatus.OK);
    }

    
    @RequestMapping(value = "/link/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> linkBusPayment(@PathVariable("id") Long id, @RequestBody BusPaymentData busPaymentData) {
        logger.info("Linking bus payment {}", busPaymentData);

        //check for validity
        if (!busPaymentData.isValid()) {
            logger.warn("Validation failure {}.", busPaymentData);
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }   
                
        TerminalPass tp = terminalPassService.findById(id);
        if (tp == null) {
            logger.warn("Terminal Pass ID {}, does not exist. ", id);
            return new ResponseEntity<>(new CustomError("Id not found!"),
                    HttpStatus.NOT_FOUND);
        }

        tp.setReceiptNumber(busPaymentData.getTerminalPass().getReceiptNumber());
        tp.setReceiptDate(busPaymentData.getTerminalPass().getReceiptDate());
        tp.setReceiptAmount(busPaymentData.getTerminalPass().getReceiptAmount());
        
        
        tp.setCollectedBy(busPaymentData.getTerminalPass().getCollectedBy());
        tp.setCollectedTime(busPaymentData.getTerminalPass().getCollectedTime());
        tp.setStatus("PAID");
        
        TerminalPass savedRow = terminalPassService.save(tp);
                
        return new ResponseEntity<>(savedRow, HttpStatus.OK);

    }
    
    @RequestMapping(value = "/unlink/{receiptno}", method = RequestMethod.PUT)
    public ResponseEntity<?> unLinkBusPayment(@PathVariable("receiptno") String receiptno, @RequestBody BusPaymentData busPaymentData) {
        logger.info("Unlinking bus payment {}", busPaymentData);

        //check for validity
        if (!busPaymentData.isValid()) {
            logger.warn("Validation failure {}.", busPaymentData);
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
                
        TerminalPass tp = terminalPassService.findByReceiptNumber(receiptno);
        if (tp == null) {
            logger.warn("Terminal Pass with receiptno {}, does not exist. ", receiptno);
            return new ResponseEntity<>(new CustomError("Id not found!"),
                    HttpStatus.NOT_FOUND);
        } else if (tp.getId().compareTo(busPaymentData.getTerminalPass().getId()) != 0) {
            //check if input is ok
            logger.warn("Failed to unlik receiptno {}", receiptno);
            return new ResponseEntity<>(new CustomError("Failed to unlik receiptno!"),
                    HttpStatus.CONFLICT);
        }

        //erase etracs link
        tp.setReceiptNumber(null);
        tp.setReceiptDate(null);
        tp.setReceiptAmount(null);
        
        tp.setCollectedBy(busPaymentData.getTerminalPass().getCollectedBy());
        tp.setCollectedTime(busPaymentData.getTerminalPass().getCollectedTime());
        
        //revert status
        tp.setStatus("ASSESSED");
        
        TerminalPass savedRow = terminalPassService.save(tp);
                
        return new ResponseEntity<>(savedRow, HttpStatus.OK);

    }

}
