/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ph.gov.naga.controller.external;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ph.gov.naga.service.MgtReportService;
import ph.gov.naga.utils.CustomError;

/**
 *
 * @author Drei
 */
@RestController
@CrossOrigin
@RequestMapping("/public/api/mgt-report")
public class MgtReportController {

    private static final Logger logger = LoggerFactory.getLogger(MgtReportController.class);

    @Autowired
    MgtReportService mgtReportService;

    @RequestMapping(value = "/excelByTripTypeDaily")
    public ResponseEntity<?> excelByTripTypeDaily(@RequestParam(name = "start") //@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            String start,
            @RequestParam(name = "end") //@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            String end) {
        logger.info("Generating excelByTypeDaily {} {}", start, end);

        Date s;
        Date e;
        try {
            s = localDateStringParse(start);
            e = localDateStringParse(end);
        } catch (Exception ex) {
            logger.error(ex.getLocalizedMessage());
            return new ResponseEntity<>(new CustomError("Invalid date."),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        byte[] result = mgtReportService.excelByTypeDaily(s, e);
        if (result == null) {
            logger.error("Failed to generate excelByTypeDaily report");
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        //do headers here
        HttpHeaders header = new HttpHeaders();
        //header.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        header.set(HttpHeaders.CONTENT_TYPE, "application/vnd.ms-excel");
        header.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=excelByTypeDaily.xls");
        return new ResponseEntity<>(result, header, HttpStatus.OK);
        
    }
    
    
    @RequestMapping(value = "/excelByBusCompanyDaily")
    public ResponseEntity<?> excelByBusCompanyDaily(@RequestParam(name = "start") //@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            String start,
            @RequestParam(name = "end") //@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            String end) {
        logger.info("Generating excelByBusCompanyDaily {} {}", start, end);

        Date s;
        Date e;
        try {
            s = localDateStringParse(start);
            e = localDateStringParse(end);
        } catch (Exception ex) {
            logger.error(ex.getLocalizedMessage());
            return new ResponseEntity<>(new CustomError("Invalid date."),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        byte[] result = mgtReportService.excelByBusCompanyDaily(s, e);
        if (result == null) {
            logger.error("Failed to generate excelByBusCompanyDaily report");
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        //do headers here
        HttpHeaders header = new HttpHeaders();
        //header.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        header.set(HttpHeaders.CONTENT_TYPE, "application/vnd.ms-excel");
        header.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=excelByBusCompanyDaily.xls");
        return new ResponseEntity<>(result, header, HttpStatus.OK);
        
    }
    
    
    @RequestMapping(value = "/excelByTripClassDaily")
    public ResponseEntity<?> excelByTripClassDaily(@RequestParam(name = "start") //@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            String start,
            @RequestParam(name = "end") //@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            String end) {
        logger.info("Generating excelByTripClassDaily {} {}", start, end);

        Date s;
        Date e;
        try {
            s = localDateStringParse(start);
            e = localDateStringParse(end);
        } catch (Exception ex) {
            logger.error(ex.getLocalizedMessage());
            return new ResponseEntity<>(new CustomError("Invalid date."),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        byte[] result = mgtReportService.excelByTripClassDaily(s, e);
        if (result == null) {
            logger.error("Failed to generate excelByTripClassDaily report");
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        //do headers here
        HttpHeaders header = new HttpHeaders();
        //header.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        header.set(HttpHeaders.CONTENT_TYPE, "application/vnd.ms-excel");
        header.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=excelByTripClassDaily.xls");
        return new ResponseEntity<>(result, header, HttpStatus.OK);
        
    }
    
    @RequestMapping(value = "/excelByTripCoverageDaily")
    public ResponseEntity<?> excelByTripCoverageDaily(@RequestParam(name = "start") //@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            String start,
            @RequestParam(name = "end") //@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            String end) {
        logger.info("Generating excelByTripCoverageDaily {} {}", start, end);

        Date s;
        Date e;
        try {
            s = localDateStringParse(start);
            e = localDateStringParse(end);
        } catch (Exception ex) {
            logger.error(ex.getLocalizedMessage());
            return new ResponseEntity<>(new CustomError("Invalid date."),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        byte[] result = mgtReportService.excelByTripCoverageDaily(s, e);
        if (result == null) {
            logger.error("Failed to generate excelByTripCoverageDaily report");
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        //do headers here
        HttpHeaders header = new HttpHeaders();
        //header.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        header.set(HttpHeaders.CONTENT_TYPE, "application/vnd.ms-excel");
        header.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=excelByTripCoverageDaily.xls");
        return new ResponseEntity<>(result, header, HttpStatus.OK);
        
    }
    
    
    @RequestMapping(value = "/xTabByTripTypeByBusCompany")
    public ResponseEntity<?> xTabByTripTypeByBusCompany(@RequestParam(name = "start") //@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            String start,
            @RequestParam(name = "end") //@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            String end) {
        logger.info("Generating xTabByTripTypeByBusCompany {} {}", start, end);

        Date s;
        Date e;
        try {
            s = localDateStringParse(start);
            e = localDateStringParse(end);
        } catch (Exception ex) {
            logger.error(ex.getLocalizedMessage());
            return new ResponseEntity<>(new CustomError("Invalid date."),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        byte[] result = mgtReportService.xTabByTripTypeByBusCompany(s, e);
        if (result == null) {
            logger.error("Failed to generate xTabByTripTypeByBusCompany report");
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        //do headers here
        HttpHeaders header = new HttpHeaders();
        //header.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        header.set(HttpHeaders.CONTENT_TYPE, "application/vnd.ms-excel");
        header.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=xTabByTripTypeByBusCompany.xls");
        return new ResponseEntity<>(result, header, HttpStatus.OK);
        
    }
    
    
    @RequestMapping(value = "/xTabByTripTypeByTripClass")
    public ResponseEntity<?> xTabByTripTypeByTripClass(@RequestParam(name = "start") //@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            String start,
            @RequestParam(name = "end") //@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            String end) {
        logger.info("Generating xTabByTripTypeByTripClass {} {}", start, end);

        Date s;
        Date e;
        try {
            s = localDateStringParse(start);
            e = localDateStringParse(end);
        } catch (Exception ex) {
            logger.error(ex.getLocalizedMessage());
            return new ResponseEntity<>(new CustomError("Invalid date."),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        byte[] result = mgtReportService.xTabByTripTypeByTripClass(s, e);
        if (result == null) {
            logger.error("Failed to generate xTabByTripTypeByTripClass report");
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        //do headers here
        HttpHeaders header = new HttpHeaders();
        //header.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        header.set(HttpHeaders.CONTENT_TYPE, "application/vnd.ms-excel");
        header.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=xTabByTripTypeByTripClass.xls");
        return new ResponseEntity<>(result, header, HttpStatus.OK);
        
    }
    
    
    @RequestMapping(value = "/xTabByTripTypeByTripCoverage")
    public ResponseEntity<?> xTabByTripTypeByTripCoverage(@RequestParam(name = "start") //@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            String start,
            @RequestParam(name = "end") //@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            String end) {
        logger.info("Generating xTabByTripTypeByTripCoverage {} {}", start, end);

        Date s;
        Date e;
        try {
            s = localDateStringParse(start);
            e = localDateStringParse(end);
        } catch (Exception ex) {
            logger.error(ex.getLocalizedMessage());
            return new ResponseEntity<>(new CustomError("Invalid date."),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        byte[] result = mgtReportService.xTabByTripTypeByTripCoverage(s, e);
        if (result == null) {
            logger.error("Failed to generate xTabByTripTypeByTripCoverage report");
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        //do headers here
        HttpHeaders header = new HttpHeaders();
        //header.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        header.set(HttpHeaders.CONTENT_TYPE, "application/vnd.ms-excel");
        header.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=xTabByTripTypeByTripCoverage.xls");
        return new ResponseEntity<>(result, header, HttpStatus.OK);
        
    }
    
    
    @RequestMapping(value = "/xTabByTripTypeByTripDestination")
    public ResponseEntity<?> xTabByTripTypeByTripDestination(@RequestParam(name = "start") //@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            String start,
            @RequestParam(name = "end") //@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            String end) {
        logger.info("Generating xTabByTripTypeByTripDestination {} {}", start, end);

        Date s;
        Date e;
        try {
            s = localDateStringParse(start);
            e = localDateStringParse(end);
        } catch (Exception ex) {
            logger.error(ex.getLocalizedMessage());
            return new ResponseEntity<>(new CustomError("Invalid date."),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        byte[] result = mgtReportService.xTabByTripTypeByTripDestination(s, e);
        if (result == null) {
            logger.error("Failed to generate xTabByTripTypeByTripDestination report");
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        //do headers here
        HttpHeaders header = new HttpHeaders();
        //header.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        header.set(HttpHeaders.CONTENT_TYPE, "application/vnd.ms-excel");
        header.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=xTabByTripTypeByTripDestination.xls");
        return new ResponseEntity<>(result, header, HttpStatus.OK);
        
    }


    private Date localDateStringParse(String dt) throws ParseException {
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(dt);
    }
}
