/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ph.gov.naga.etracs.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ph.gov.naga.etracs.model.CashReceiptItem;

/**
 *
 * @author Drei
 */
//@RepositoryRestResource
public interface CashReceiptItemRepository extends JpaRepository<CashReceiptItem, String>{
    
    //FK ref to casheceipt.objid
    List<CashReceiptItem> findByReceiptid (String receiptid);
    
}
