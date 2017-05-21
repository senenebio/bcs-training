/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ph.gov.naga.repository;

import java.util.Date;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ph.gov.naga.model.TerminalPass;

/**
 *
 * @author Drei
 */
public interface TerminalPassRepository extends JpaRepository<TerminalPass, Long> {

    List<TerminalPass> findByPlateNumberOrderByIdDesc(String plateNumber);

    List<TerminalPass> findByBodyNumberOrderByIdDesc(String bodyNumber);

    List<TerminalPass> findByStatus(String status);
    
    TerminalPass findByReceiptNumber(String receiptno);

    //@Query("select t from TerminalPass t where t.arrivalTime between ?1 and ?2")
    List<TerminalPass> findByArrivalTimeBetween(Date start, Date end);
    
    //@Query("select t from TerminalPass t where t.departureTime between ?1 and ?2")
    List<TerminalPass> findByDepartureTimeBetween(Date start, Date end);
}
