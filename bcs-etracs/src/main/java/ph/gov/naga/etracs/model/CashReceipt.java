/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ph.gov.naga.etracs.model;

import java.math.BigDecimal;
import java.util.Date;
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
@Table(name="cashreceipt")
@Data
public class CashReceipt {
    //`objid` VARCHAR(50) NOT NULL,
    @Id
    private String objid;
    
    //`state` VARCHAR(10) NOT NULL,
    private String state;
    
    //`txndate` DATETIME NOT NULL,
    private Date txndate;
    
    //`receiptno` VARCHAR(50) NOT NULL,
    private String receiptno;

    //`receiptdate` DATETIME NOT NULL,
    private Date receiptdate;
    
    //`txnmode` VARCHAR(10) NOT NULL,
    private String txnmode;
    
    //`payer_objid` VARCHAR(50) NULL DEFAULT NULL,
    @Column(name="payer_objid")
    private String payerobjid;
    
    //`payer_name` TEXT NULL,
    @Column(name = "payer_name", columnDefinition = "TEXT")
    private String payername;
    
    //`paidby` TEXT NULL,
    @Column(columnDefinition = "TEXT")
    private String paidby;
    
    //`paidbyaddress` VARCHAR(100) NOT NULL,
    private String paidbyaddress;
    
    //`amount` DECIMAL(16,4) NULL DEFAULT NULL,
    private BigDecimal amount;
    
    //`collector_objid` VARCHAR(50) NOT NULL,
    @Column(name="collector_objid")
    private String collectorobjid;
    
    //`collector_name` VARCHAR(100) NOT NULL,
    private String collector_name;
    
    //`collector_title` VARCHAR(50) NOT NULL,
    @Column(name="collector_title")
    private String collectortitle;
    
    //`totalcash` DECIMAL(16,4) NULL DEFAULT NULL,
    private BigDecimal totalcash;
    
    //`totalnoncash` DECIMAL(16,4) NULL DEFAULT NULL,
    private BigDecimal totalnoncash;
    
    //`cashchange` DECIMAL(16,2) NOT NULL,
    private BigDecimal cashchange;
    
    //`totalcredit` DECIMAL(16,2) NOT NULL,
    private BigDecimal totalcredit;
    
    //`org_objid` VARCHAR(50) NOT NULL,
    @Column(name="org_objid")
    private String orgobjid;
    
    //`org_name` VARCHAR(50) NOT NULL,
    @Column(name="org_name")
    private String orgname;
    
    //`formno` VARCHAR(50) NOT NULL,
    private String formno;
    
    //`series` INT(11) NOT NULL,
    private Integer series;
    
    //`controlid` VARCHAR(50) NOT NULL,
    private String controlid;
    
    //`collectiontype_objid` VARCHAR(50) NULL DEFAULT NULL,
    @Column(name="collectiontype_objid")
    private String collectiontypeobjid;
    
    //`collectiontype_name` VARCHAR(100) NULL DEFAULT NULL,
    @Column(name="collectiontype_name")
    private String collectiontypename;
    
    //`user_objid` VARCHAR(50) NULL DEFAULT NULL,
    @Column(name="user_objid")
    private String userobjid;
    
    //`user_name` VARCHAR(100) NULL DEFAULT NULL,
    @Column(name="user_name")
    private String username;
    
    //`remarks` VARCHAR(200) NULL DEFAULT NULL,
    private String remarks;
    
    //`subcollector_objid` VARCHAR(50) NULL DEFAULT NULL,
    @Column(name="subcollector_objid")
    private String subcollectorobjid;
    
    //`subcollector_name` VARCHAR(100) NULL DEFAULT NULL,
    @Column(name="subcollector_name")
    private String subcollectorname;
    
    //`subcollector_title` VARCHAR(50) NULL DEFAULT NULL,
    @Column(name="subcollector_title")
    private String subcollectortitle;
    
    //`formtype` VARCHAR(25) NULL DEFAULT NULL,
    private String formtype;
    
    //`stub` VARCHAR(25) NULL DEFAULT NULL,
    private String stub;
    
}
