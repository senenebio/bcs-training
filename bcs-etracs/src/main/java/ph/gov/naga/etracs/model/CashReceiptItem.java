/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ph.gov.naga.etracs.model;

import java.math.BigDecimal;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;

/**
 *
 * @author Drei
 */
@Entity
@Table(name="cashreceiptitem")
@Data
public class CashReceiptItem {
    //`objid` VARCHAR(50) NOT NULL,
    @Id
    private String objid;
     
    //`receiptid` VARCHAR(50) NULL DEFAULT NULL,
    private String receiptid;
    
    //`item_objid` VARCHAR(50) NULL DEFAULT NULL,
    private String item_objid;
    
    //`item_code` VARCHAR(100) NULL DEFAULT NULL,
    @Column(name="item_code")
    private String itemcode;
    
    //`item_title` VARCHAR(100) NULL DEFAULT NULL,
    @Column(name="item_title")
    private String itemtitle;
    
    //`amount` DECIMAL(16,4) NULL DEFAULT NULL,
    private BigDecimal amount; 

    //`remarks` VARCHAR(255) NULL DEFAULT NULL,
    private String remarks;
}
