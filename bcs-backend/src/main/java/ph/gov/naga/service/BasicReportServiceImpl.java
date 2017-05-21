/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ph.gov.naga.service;

import java.util.Date;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ph.gov.naga.model.TerminalPass;
import ph.gov.naga.repository.TerminalPassRepository;

/**
 *
 * @author Drei
 */
@Service
public class BasicReportServiceImpl implements BasicReportService {

    private static final Logger logger = LoggerFactory.getLogger(BasicReportServiceImpl.class);

    @Autowired
    private TerminalPassRepository terminalPassRepository;

    @Override
    public List<TerminalPass> findArrivalsBetweenDates(Date startDate, Date endDate) {
        logger.info("Finding Terminal Pass arriving between {} and  {}", startDate, endDate);

        return terminalPassRepository.findByArrivalTimeBetween(startDate, endDate);

    }

    @Override
    public List<TerminalPass> findDeparturesBetweenDates(Date startDate, Date endDate) {
        logger.info("Finding Terminal Pass departing between {} and  {}", startDate, endDate);

        return terminalPassRepository.findByDepartureTimeBetween(startDate, endDate);
    }

}
