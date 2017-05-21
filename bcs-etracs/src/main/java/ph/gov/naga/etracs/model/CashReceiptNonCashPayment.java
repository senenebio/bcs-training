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
@Table(name = "cashreceiptpayment_noncash")
@Data
public class CashReceiptNonCashPayment {

    //`objid` VARCHAR(50) NOT NULL,
    @Id
    private String objid;

    //`receiptid` VARCHAR(50) NULL DEFAULT NULL,
    private String receiptid;

    //`bank` VARCHAR(50) NULL DEFAULT NULL,
    private String bank;

    //`refno` VARCHAR(25) NULL DEFAULT NULL,
    private String refno;

    //`refdate` DATETIME NULL DEFAULT NULL,
    private Date refdate;

    //`reftype` VARCHAR(50) NULL DEFAULT NULL,
    private String reftype;

    //`amount` DECIMAL(16,2) NULL DEFAULT NULL,
    private BigDecimal amount;

    //`particulars` VARCHAR(255) NULL DEFAULT NULL,
    private String particulars;

    //`bankid` VARCHAR(50) NULL DEFAULT NULL,
    private String bankid;

    //`deposittype` VARCHAR(50) NULL DEFAULT NULL,
    private String deposittype;

    //`account_objid` VARCHAR(50) NULL DEFAULT NULL,
    @Column(name="account_objid")
    private String accountobjid;

    //`account_code` VARCHAR(50) NULL DEFAULT NULL,
    @Column(name="account_code")
    private String accountcode;

    //`account_name` VARCHAR(100) NULL DEFAULT NULL,
    @Column(name="account_name")
    private String accountname;

    //`account_fund_objid` VARCHAR(50) NULL DEFAULT NULL,
    @Column(name="account_fund_objid")
    private String accountfundobjid;

    //`account_fund_name` VARCHAR(50) NULL DEFAULT NULL,
    @Column(name="account_fund_name")
    private String accountfundname;

    //`account_bank` VARCHAR(100) NULL DEFAULT NULL,
    @Column(name="account_bank")    
    private String accountbank;

}
