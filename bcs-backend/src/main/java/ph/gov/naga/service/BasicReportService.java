/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ph.gov.naga.service;

import java.util.Date;
import java.util.List;
import ph.gov.naga.model.TerminalPass;

/**
 *
 * @author Drei
 */
public interface BasicReportService {
    
    List<TerminalPass> findArrivalsBetweenDates(Date startDate, Date endDate);
    List<TerminalPass> findDeparturesBetweenDates(Date startDate, Date endDate);
    
}
