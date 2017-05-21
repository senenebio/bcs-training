/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ph.gov.naga.etracs.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Date;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;
import javax.persistence.Transient;
import lombok.Data;

/**
 *
 * @author Drei
 */
@Entity
@Table(name="sys_user")
@Data
public class SysUser {
    
    //`objid` VARCHAR(50) NOT NULL,
    @Id
    private String objid;
   
    //`state` VARCHAR(15) NULL DEFAULT NULL,
    private String state;
   
    //`dtcreated` DATETIME NULL DEFAULT NULL,
    private Date dtcreated;
   
    //`createdby` VARCHAR(50) NULL DEFAULT NULL,
    private String createdby;
    
    //`username` VARCHAR(50) NULL DEFAULT NULL,
    private String username;
    
    //`pwd` VARCHAR(50) NULL DEFAULT NULL,
    private String pwd;
    
    //`firstname` VARCHAR(50) NULL DEFAULT NULL,
    private String firstname;
    
    //`lastname` VARCHAR(50) NULL DEFAULT NULL,
    private String lastname;
    
    //`middlename` VARCHAR(50) NULL DEFAULT NULL,
    private String middlename;
    
    //`name` VARCHAR(50) NULL DEFAULT NULL,
    private String name;
    
    //`jobtitle` VARCHAR(50) NULL DEFAULT NULL,
    private String jobtitle;

    //`pwdlogincount` INT(11) NULL DEFAULT NULL,
    private String pwdlogincount; 

    //`pwdexpirydate` DATETIME NULL DEFAULT NULL,
    private Date pwdexpirydate;
    
    //`usedpwds` LONGTEXT NULL,
    @Lob
    private String usedpwds;
    
    //`lockid` VARCHAR(32) NULL DEFAULT NULL,
    private String lockid;
    
    //`txncode` VARCHAR(10) NULL DEFAULT NULL,
    private String txncode;
    
}
