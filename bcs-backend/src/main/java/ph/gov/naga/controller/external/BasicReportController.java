/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ph.gov.naga.controller.external;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ph.gov.naga.model.TerminalPass;
import ph.gov.naga.service.BasicReportService;
import ph.gov.naga.utils.CustomError;

/**
 *
 * @author Drei
 */
@RestController
@CrossOrigin
@RequestMapping("/public/api/basic-report")
public class BasicReportController {

    private static final Logger logger = LoggerFactory.getLogger(BasicReportController.class);

    @Autowired
    BasicReportService basicReportService;

    @RequestMapping(value = "/arrival")
    public ResponseEntity<?> findArrivals(@RequestParam(name = "start")
            //@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            String start,
            @RequestParam(name = "end")
            //@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            String end) {

        logger.info("Finding arrivals between {} and {}", start, end);
        
        //convert strings to date, java time magic
        Date s = null;
        Date e = null;
        try {
            
            DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            s = df.parse(start);
            e = df.parse(end);
            

        } catch (Exception ex) {
            logger.error(ex.getLocalizedMessage());
            return new ResponseEntity<>(new CustomError("Invalid date."),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

        List<TerminalPass> result = basicReportService.findArrivalsBetweenDates(s, e);
        if (result.isEmpty()) {
            logger.warn("Nothing found!");
            return new ResponseEntity<>(new CustomError("Nothing found!"),
                    HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/departure")
    public ResponseEntity<?> findDepartures(@RequestParam(name = "start")
            //@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            String start,
            @RequestParam(name = "end")
            //@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            String end) {

        logger.info("Finding departures between {} and {}", start, end);
        
        //convert strings to date, java time magic
        Date s = null;
        Date e = null;
        try {
            
            DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            s = df.parse(start);
            e = df.parse(end);
            
        } catch (Exception ex) {
            logger.error(ex.getLocalizedMessage());
            return new ResponseEntity<>(new CustomError("Invalid date."),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

        List<TerminalPass> result = basicReportService.findDeparturesBetweenDates(s, e);
        if (result.isEmpty()) {
            logger.warn("Nothing found!");
            return new ResponseEntity<>(new CustomError("Nothing found!"),
                    HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}
