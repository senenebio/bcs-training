/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ph.gov.naga.etracs.model;

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
@Table(name = "af_control")
@Data
public class AFControl {
    
    //`objid` VARCHAR(50) NOT NULL,
    @Id
    private String objid;
    
    //`afid` VARCHAR(50) NULL DEFAULT NULL,
    private String afid;
    
    //`txnmode` VARCHAR(10) NULL DEFAULT NULL,
    private String txnmode;
    
    //`assignee_objid` VARCHAR(50) NULL DEFAULT NULL,
    @Column(name="assignee_objid")
    private String assigneeobjid;
    
    //`assignee_name` VARCHAR(50) NULL DEFAULT NULL,
    @Column(name="assignee_name")
    private String assigneename;
    
    //`startseries` INT(11) NULL DEFAULT NULL,
    private Integer startseries;
    
    //`currentseries` INT(11) NULL DEFAULT NULL,
    private Integer currentseries;
    
    //`endseries` INT(11) NULL DEFAULT NULL,
    private Integer endseries;
    
    //`active` INT(11) NULL DEFAULT NULL,
    private Integer active;
    
    //`org_objid` VARCHAR(50) NULL DEFAULT NULL,
    @Column(name="org_objid")
    private String orgobjid;
    
    //`org_name` VARCHAR(50) NULL DEFAULT NULL,
    @Column(name="org_name")
    private String orgname;
    
    //`fund_objid` VARCHAR(50) NULL DEFAULT NULL,
    @Column(name="fund_objid")
    private String fundobjid;
    
    //`fund_title` VARCHAR(200) NULL DEFAULT NULL,
    @Column(name="fund_title")
    private String fundtitle;
    
    //`stubno` INT(11) NULL DEFAULT NULL,
    private Integer stubno;
        
    //`owner_objid` VARCHAR(50) NULL DEFAULT NULL,
    @Column(name="owner_objid")
    private String ownerobjid;
    
    //`owner_name` VARCHAR(255) NULL DEFAULT NULL,
    @Column(name="owner_name")
    private String ownername;
    
    //`prefix` VARCHAR(10) NULL DEFAULT NULL,
    private String prefix;
    
    //`suffix` VARCHAR(10) NULL DEFAULT NULL,
    private String suffix;
    
}
