/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ph.gov.naga.etracs.repository;

import java.util.Date;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ph.gov.naga.etracs.model.CashReceipt;

/**
 *
 * @author Drei
 */
//@RepositoryRestResource
public interface CashReceiptRepository extends JpaRepository<CashReceipt, String>{
    
    //this is a unique index in table cashreceipt
    CashReceipt findByReceiptno(String receiptno);
    
    //Not very efficient - can have performance issue
    List<CashReceipt> findByReceiptnoContaining(String receiptno); 

    //column txndate is indexed
    List<CashReceipt> findByTxndateBetween(Date start, Date end);
}
