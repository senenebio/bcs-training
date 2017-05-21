/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ph.gov.naga.etracs.repository;


import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ph.gov.naga.etracs.model.SysUser;

/**
 *
 * @author Drei
 */
//@RepositoryRestResource
public interface SysUserRepository extends JpaRepository<SysUser, String> {

    SysUser findByUsername(String username);
    
}
