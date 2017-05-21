/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ph.gov.naga.service;

import java.util.Date;

/**
 *
 * @author Drei
 */
public interface MgtReportService {

    byte[] excelByTypeDaily(Date startDate, Date endDate);

    byte[] excelByBusCompanyDaily(Date startDate, Date endDate);

    byte[] excelByTripClassDaily(Date startDate, Date endDate);

    byte[] excelByTripCoverageDaily(Date startDate, Date endDate);

    byte[] xTabByTripTypeByBusCompany(Date startDate, Date endDate);

    byte[] xTabByTripTypeByTripCoverage(Date startDate, Date endDate);

    byte[] xTabByTripTypeByTripClass(Date startDate, Date endDate);

    byte[] xTabByTripTypeByTripDestination(Date startDate, Date endDate);

}
