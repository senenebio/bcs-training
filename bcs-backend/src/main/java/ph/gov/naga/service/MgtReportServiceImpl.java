/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ph.gov.naga.service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import net.sf.dynamicreports.report.base.expression.AbstractSimpleExpression;
import static net.sf.dynamicreports.report.builder.DynamicReports.asc;
import static net.sf.dynamicreports.report.builder.DynamicReports.cmp;
import static net.sf.dynamicreports.report.builder.DynamicReports.col;
import static net.sf.dynamicreports.report.builder.DynamicReports.ctab;
import static net.sf.dynamicreports.report.builder.DynamicReports.field;
import static net.sf.dynamicreports.report.builder.DynamicReports.grp;
import static net.sf.dynamicreports.report.builder.DynamicReports.report;
import static net.sf.dynamicreports.report.builder.DynamicReports.type;
import net.sf.dynamicreports.report.builder.column.TextColumnBuilder;
import net.sf.dynamicreports.report.builder.crosstab.CrosstabBuilder;
import net.sf.dynamicreports.report.builder.crosstab.CrosstabColumnGroupBuilder;
import net.sf.dynamicreports.report.builder.crosstab.CrosstabMeasureBuilder;
import net.sf.dynamicreports.report.builder.crosstab.CrosstabRowGroupBuilder;
import net.sf.dynamicreports.report.builder.group.ColumnGroupBuilder;
import net.sf.dynamicreports.report.constant.Calculation;
import net.sf.dynamicreports.report.constant.PageOrientation;
import net.sf.dynamicreports.report.constant.PageType;
import net.sf.dynamicreports.report.definition.ReportParameters;
import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ph.gov.naga.model.TerminalPass;
import ph.gov.naga.utils.Templates;

/**
 *
 * @author Drei
 */
@Service
public class MgtReportServiceImpl implements MgtReportService {

    private static final Logger logger = LoggerFactory.getLogger(MgtReportServiceImpl.class);

    @Autowired
    private BasicReportService basicReportService;

    @Override
    public byte[] excelByTypeDaily(Date startDate, Date endDate) {

        //collect data from departures
        List<TerminalPass> tps = basicReportService.findDeparturesBetweenDates(startDate, endDate);
        logger.info("Found {} rows.", tps.size());

        if (!tps.isEmpty()) {
            JRDataSource ds = new JRBeanCollectionDataSource(tps);

            //groupings
            TextColumnBuilder<String> cTripType = col.column("Trip Type", "tripType", type.stringType());
            TextColumnBuilder<Date> cDepartureDate = col.column("Deparute Date", "departureTime", type.dateType());

            ColumnGroupBuilder grpTripType = grp.group(cTripType).groupByDataType();
            ColumnGroupBuilder grpDepartureDate = grp.group(cDepartureDate).groupByDataType();

            //columns
            TextColumnBuilder<String> cPlateNumber = col.column("Plate Number", "plateNumber", type.stringType());
            TextColumnBuilder<String> cBodyNumber = col.column("Body Number", "bodyNumber", type.stringType());
            TextColumnBuilder<String> cBusCompany = col.column("Bus Company", "busCompany", type.stringType());
            TextColumnBuilder<String> cTripClass = col.column("Trip Class", "tripClass", type.stringType());
            TextColumnBuilder<String> cTripCoverage = col.column("Trip Coverage", "tripCoverage", type.stringType());

            TextColumnBuilder<Date> cArrivalTime = col.column("Arrival Time", "arrivalTime", type.dateYearToMinuteType());
            TextColumnBuilder<String> cTripLoadingBay = col.column("Loading Bay", "tripLoadingBay", type.stringType());
            TextColumnBuilder<Date> cTripLoadingStart = col.column("Loading Start", "tripLoadingStart", type.dateType());
            cTripLoadingStart.setPattern("HH:mm");
            TextColumnBuilder<Date> cTripLoadingEnd = col.column("Loading End", "tripLoadingEnd", type.dateType());
            cTripLoadingEnd.setPattern("HH:mm");
            TextColumnBuilder<Date> cDepartureTime = col.column("Departure Time", "departureTime", type.dateYearToMinuteType());
            TextColumnBuilder<BigDecimal> cReceiptAmount = col.column("Amount Paid", "receiptAmount", type.bigDecimalType());

            try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
                report()
                        .setPageFormat(PageType.A4, PageOrientation.LANDSCAPE)
                        .setTemplate(Templates.reportTemplate)
                        .columns(cTripType, cDepartureDate,
                                cBusCompany, cPlateNumber, cBodyNumber, cTripClass, cTripCoverage,
                                cArrivalTime, cTripLoadingBay, cTripLoadingStart,
                                cTripLoadingEnd, cDepartureTime, cReceiptAmount)
                        .sortBy(asc(cTripType), asc(cDepartureTime))
                        .groupBy(grpTripType, grpDepartureDate)
                        .title(Templates.createTitleComponent("By Trip Type"))
                        .pageFooter(Templates.footerComponent)
                        .setDataSource(ds)
                        .toXls(os);

                return os.toByteArray();
            } catch (Exception ex) {
                logger.error("Error: {}", ex.getLocalizedMessage());
            }
        }
        return null;
    }

    @Override
    public byte[] excelByBusCompanyDaily(Date startDate, Date endDate) {

        //collect data from departures
        List<TerminalPass> tps = basicReportService.findDeparturesBetweenDates(startDate, endDate);
        logger.info("Found {} rows.", tps.size());

        if (!tps.isEmpty()) {
            JRDataSource ds = new JRBeanCollectionDataSource(tps);

            //groupings            
            TextColumnBuilder<String> cBusCompany = col.column("Bus Company", "busCompany", type.stringType());
            TextColumnBuilder<Date> cDepartureDate = col.column("Departure Date", "departureTime", type.dateType());

            ColumnGroupBuilder grpBusCompany = grp.group(cBusCompany).groupByDataType();
            ColumnGroupBuilder grpDepartureDate = grp.group(cDepartureDate).groupByDataType();

            //columns
            TextColumnBuilder<String> cPlateNumber = col.column("Plate Number", "plateNumber", type.stringType());
            TextColumnBuilder<String> cBodyNumber = col.column("Body Number", "bodyNumber", type.stringType());
            TextColumnBuilder<String> cTripType = col.column("Trip Type", "tripType", type.stringType());
            TextColumnBuilder<String> cTripClass = col.column("Trip Class", "tripClass", type.stringType());
            TextColumnBuilder<String> cTripCoverage = col.column("Trip Coverage", "tripCoverage", type.stringType());

            TextColumnBuilder<Date> cArrivalTime = col.column("Arrival Time", "arrivalTime", type.dateYearToMinuteType());
            TextColumnBuilder<String> cTripLoadingBay = col.column("Loading Bay", "tripLoadingBay", type.stringType());
            TextColumnBuilder<Date> cTripLoadingStart = col.column("Loading Start", "tripLoadingStart", type.dateType());
            cTripLoadingStart.setPattern("HH:mm");
            TextColumnBuilder<Date> cTripLoadingEnd = col.column("Loading End", "tripLoadingEnd", type.dateType());
            cTripLoadingEnd.setPattern("HH:mm");
            TextColumnBuilder<Date> cDepartureTime = col.column("Departure Time", "departureTime", type.dateYearToMinuteType());
            TextColumnBuilder<BigDecimal> cReceiptAmount = col.column("Amount Paid", "receiptAmount", type.bigDecimalType());

            try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
                report()
                        .setPageFormat(PageType.A4, PageOrientation.LANDSCAPE)
                        .setTemplate(Templates.reportTemplate)
                        .columns(cBusCompany, cDepartureDate,
                                cPlateNumber, cBodyNumber, cTripType, cTripClass, cTripCoverage,
                                cArrivalTime, cTripLoadingBay, cTripLoadingStart,
                                cTripLoadingEnd, cDepartureTime, cReceiptAmount)
                        .sortBy(asc(cBusCompany), asc(cDepartureTime))
                        .groupBy(grpBusCompany, grpDepartureDate)
                        .title(Templates.createTitleComponent("By Bus Company"))
                        .pageFooter(Templates.footerComponent)
                        .setDataSource(ds)
                        .toXls(os);
                return os.toByteArray();
            } catch (Exception ex) {
                logger.error("Error: {}", ex.getLocalizedMessage());
            }
        }
        return null;
    }

    @Override
    public byte[] excelByTripClassDaily(Date startDate, Date endDate) {

        //collect data from departures
        List<TerminalPass> tps = basicReportService.findDeparturesBetweenDates(startDate, endDate);
        logger.info("Found {} rows.", tps.size());

        if (!tps.isEmpty()) {
            JRDataSource ds = new JRBeanCollectionDataSource(tps);

            //groupings
            TextColumnBuilder<String> cTripClass = col.column("Trip Class", "tripClass", type.stringType());
            TextColumnBuilder<Date> cDepartureDate = col.column("Departure Date", "departureTime", type.dateType());

            ColumnGroupBuilder grpTripClass = grp.group(cTripClass).groupByDataType();
            ColumnGroupBuilder grpDepartureDate = grp.group(cDepartureDate).groupByDataType();

            //columns
            TextColumnBuilder<String> cPlateNumber = col.column("Plate Number", "plateNumber", type.stringType());
            TextColumnBuilder<String> cBodyNumber = col.column("Body Number", "bodyNumber", type.stringType());
            TextColumnBuilder<String> cBusCompany = col.column("Bus Company", "busCompany", type.stringType());
            TextColumnBuilder<String> cTripType = col.column("Trip Type", "tripType", type.stringType());
            TextColumnBuilder<String> cTripCoverage = col.column("Trip Coverage", "tripCoverage", type.stringType());

            TextColumnBuilder<Date> cArrivalTime = col.column("Arrival Time", "arrivalTime", type.dateYearToMinuteType());
            TextColumnBuilder<String> cTripLoadingBay = col.column("Loading Bay", "tripLoadingBay", type.stringType());
            TextColumnBuilder<Date> cTripLoadingStart = col.column("Loading Start", "tripLoadingStart", type.dateType());
            cTripLoadingStart.setPattern("HH:mm");
            TextColumnBuilder<Date> cTripLoadingEnd = col.column("Loading End", "tripLoadingEnd", type.dateType());
            cTripLoadingEnd.setPattern("HH:mm");
            TextColumnBuilder<Date> cDepartureTime = col.column("Departure Time", "departureTime", type.dateYearToMinuteType());
            TextColumnBuilder<BigDecimal> cReceiptAmount = col.column("Amount Paid", "receiptAmount", type.bigDecimalType());

            try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
                report()
                        .setPageFormat(PageType.A4, PageOrientation.LANDSCAPE)
                        .setTemplate(Templates.reportTemplate)
                        .columns(cTripClass, cDepartureDate,
                                cBusCompany, cPlateNumber, cBodyNumber, cTripType, cTripCoverage,
                                cArrivalTime, cTripLoadingBay, cTripLoadingStart,
                                cTripLoadingEnd, cDepartureTime, cReceiptAmount)
                        .sortBy(asc(cTripClass), asc(cDepartureTime))
                        .groupBy(grpTripClass, grpDepartureDate)
                        .title(Templates.createTitleComponent("By Trip Class"))
                        .pageFooter(Templates.footerComponent)
                        .setDataSource(ds)
                        .toXls(os);
                return os.toByteArray();
            } catch (Exception ex) {
                logger.error("Error: {}", ex.getLocalizedMessage());
            }
        }
        return null;
    }

    @Override
    public byte[] excelByTripCoverageDaily(Date startDate, Date endDate) {

        //collect data from departures
        List<TerminalPass> tps = basicReportService.findDeparturesBetweenDates(startDate, endDate);
        logger.info("Found {} rows.", tps.size());

        if (!tps.isEmpty()) {
            JRDataSource ds = new JRBeanCollectionDataSource(tps);

            //groupings
            TextColumnBuilder<String> cTripCoverage = col.column("Trip Coverage", "tripCoverage", type.stringType());
            TextColumnBuilder<Date> cDepartureDate = col.column("Departure Date", "departureTime", type.dateType());

            ColumnGroupBuilder grpTripCoverage = grp.group(cTripCoverage).groupByDataType();
            ColumnGroupBuilder grpDepartureDate = grp.group(cDepartureDate).groupByDataType();

            //columns
            TextColumnBuilder<String> cPlateNumber = col.column("Plate Number", "plateNumber", type.stringType());
            TextColumnBuilder<String> cBodyNumber = col.column("Body Number", "bodyNumber", type.stringType());
            TextColumnBuilder<String> cBusCompany = col.column("Bus Company", "busCompany", type.stringType());
            TextColumnBuilder<String> cTripType = col.column("Trip Type", "tripType", type.stringType());
            TextColumnBuilder<String> cTripClass = col.column("Trip Class", "tripClass", type.stringType());

            TextColumnBuilder<Date> cArrivalTime = col.column("Arrival Time", "arrivalTime", type.dateYearToMinuteType());
            TextColumnBuilder<String> cTripLoadingBay = col.column("Loading Bay", "tripLoadingBay", type.stringType());
            TextColumnBuilder<Date> cTripLoadingStart = col.column("Loading Start", "tripLoadingStart", type.dateType());
            cTripLoadingStart.setPattern("HH:mm");
            TextColumnBuilder<Date> cTripLoadingEnd = col.column("Loading End", "tripLoadingEnd", type.dateType());
            cTripLoadingEnd.setPattern("HH:mm");
            TextColumnBuilder<Date> cDepartureTime = col.column("Departure Time", "departureTime", type.dateYearToMinuteType());
            TextColumnBuilder<BigDecimal> cReceiptAmount = col.column("Amount Paid", "receiptAmount", type.bigDecimalType());

            try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
                report()
                        .setPageFormat(PageType.A4, PageOrientation.LANDSCAPE)
                        .setTemplate(Templates.reportTemplate)
                        .columns(cTripCoverage, cDepartureDate,
                                cBusCompany, cPlateNumber, cBodyNumber, cTripType, cTripClass,
                                cArrivalTime, cTripLoadingBay, cTripLoadingStart,
                                cTripLoadingEnd, cDepartureTime, cReceiptAmount)
                        .sortBy(asc(cTripCoverage), asc(cDepartureTime))
                        .groupBy(grpTripCoverage, grpDepartureDate)
                        .title(Templates.createTitleComponent("By Trip Coverage"))
                        .pageFooter(Templates.footerComponent)
                        .setDataSource(ds)
                        .toXls(os);
                return os.toByteArray();
            } catch (Exception ex) {
                logger.error("Error: {}", ex.getLocalizedMessage());
            }
        }
        return null;
    }

    @Override
    public byte[] xTabByTripTypeByBusCompany(Date startDate, Date endDate) {

        //collect data from departures
        List<TerminalPass> tps = basicReportService.findDeparturesBetweenDates(startDate, endDate);
        logger.info("Found {} rows.", tps.size());
        if (!tps.isEmpty()) {

            //set uo data source 
            JRDataSource ds = new JRBeanCollectionDataSource(tps);

            //row(s)
            CrosstabRowGroupBuilder<String> rowDepartureYearMonthGroup = ctab.rowGroup(new DepartureYearMonthExpression())
                    .setHeaderWidth(80);
            CrosstabRowGroupBuilder<String> rowDepartureDateGroup = ctab.rowGroup(new DepartureDateExpression())
                    .setHeaderWidth(80);
            CrosstabRowGroupBuilder<String> rowBusCompanyGroup = ctab.rowGroup("busCompany", String.class);

            //column(s)
            CrosstabColumnGroupBuilder<String> columnTripTypeGroup = ctab.columnGroup("tripType", String.class);

            //measure(s)
            CrosstabMeasureBuilder<Long> tripTypeMeasure = ctab.measure("Count", "id", Long.class, Calculation.COUNT);
            CrosstabMeasureBuilder<BigDecimal> receiptAmountMeasure = ctab.measure("Amout Paid", "receiptAmount", BigDecimal.class, Calculation.SUM);

            CrosstabBuilder crosstab = ctab.crosstab()
                    .setDataPreSorted(true)
                    .setCellWidth(110)
                    .headerCell(cmp.text("Depart Date / Trip Type / Bus Company").setStyle(Templates.boldCenteredStyle))
                    .rowGroups(
                            rowDepartureYearMonthGroup, rowDepartureDateGroup, rowBusCompanyGroup)
                    .columnGroups(
                            columnTripTypeGroup)
                    .measures(
                            tripTypeMeasure, receiptAmountMeasure);

            try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
                report()
                        .fields(field("id", Long.class), field("tripType", String.class),
                                field("busCompany", String.class), field("departureTime", Date.class))
                        .setPageFormat(PageType.A4, PageOrientation.LANDSCAPE)
                        .setTemplate(Templates.reportTemplate)
                        .title(Templates.createTitleComponent("XTab By Trip Type By Company"))
                        .pageFooter(Templates.footerComponent)
                        .sortBy(asc(field("busCompany", String.class)), asc(field("departureTime", Date.class)))
                        .setDataSource(ds)
                        .summary(crosstab)
                        .toXls(os);
                return os.toByteArray();
            } catch (Exception ex) {
                logger.error("Error: {}", ex.getLocalizedMessage());
            }
        }

        return null;
    }

    @Override
    public byte[] xTabByTripTypeByTripClass(Date startDate, Date endDate) {

        //collect data from departures
        List<TerminalPass> tps = basicReportService.findDeparturesBetweenDates(startDate, endDate);
        logger.info("Found {} rows.", tps.size());
        if (!tps.isEmpty()) {

            //set uo data source 
            JRDataSource ds = new JRBeanCollectionDataSource(tps);

            //row(s)
            CrosstabRowGroupBuilder<String> rowDepartureYearMonthGroup = ctab.rowGroup(new DepartureYearMonthExpression())
                    .setHeaderWidth(80);
            CrosstabRowGroupBuilder<String> rowDepartureDateGroup = ctab.rowGroup(new DepartureDateExpression())
                    .setHeaderWidth(80);
            CrosstabRowGroupBuilder<String> rowTripClassGroup = ctab.rowGroup("tripClass", String.class);

            //column(s)
            CrosstabColumnGroupBuilder<String> columnTripTypeGroup = ctab.columnGroup("tripType", String.class);

            //measure(s)
            CrosstabMeasureBuilder<Long> tripTypeMeasure = ctab.measure("Count", "id", Long.class, Calculation.COUNT);
            CrosstabMeasureBuilder<BigDecimal> receiptAmountMeasure = ctab.measure("Amout Paid", "receiptAmount", BigDecimal.class, Calculation.SUM);

            CrosstabBuilder crosstab = ctab.crosstab()
                    .setDataPreSorted(true)
                    .setCellWidth(110)
                    .headerCell(cmp.text("Depart Date / Trip Type / Trip Class").setStyle(Templates.boldCenteredStyle))
                    .rowGroups(
                            rowDepartureYearMonthGroup, rowDepartureDateGroup, rowTripClassGroup)
                    .columnGroups(
                            columnTripTypeGroup)
                    .measures(
                            tripTypeMeasure, receiptAmountMeasure);

            try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
                report()
                        .fields(field("id", Long.class), field("tripType", String.class), 
                                field("tripClass", String.class), field("departureTime", Date.class))
                        .setPageFormat(PageType.A4, PageOrientation.LANDSCAPE)
                        .setTemplate(Templates.reportTemplate)
                        .title(Templates.createTitleComponent("XTab By Trip Type By Class"))
                        .pageFooter(Templates.footerComponent)
                        .sortBy(asc(field("tripClass", String.class)), asc(field("departureTime", Date.class)))
                        .setDataSource(ds)
                        .summary(crosstab)
                        .toXls(os);
                return os.toByteArray();
            } catch (Exception ex) {
                logger.error("Error: {}", ex.getLocalizedMessage());
            }
        }

        return null;
    }
    
    
    @Override
    public byte[] xTabByTripTypeByTripCoverage(Date startDate, Date endDate) {

        //collect data from departures
        List<TerminalPass> tps = basicReportService.findDeparturesBetweenDates(startDate, endDate);
        logger.info("Found {} rows.", tps.size());
        if (!tps.isEmpty()) {

            //set uo data source 
            JRDataSource ds = new JRBeanCollectionDataSource(tps);

            //row(s)
            CrosstabRowGroupBuilder<String> rowDepartureYearMonthGroup = ctab.rowGroup(new DepartureYearMonthExpression())
                    .setHeaderWidth(80);
            CrosstabRowGroupBuilder<String> rowDepartureDateGroup = ctab.rowGroup(new DepartureDateExpression())
                    .setHeaderWidth(80);
            CrosstabRowGroupBuilder<String> rowTripCoverageGroup = ctab.rowGroup("tripCoverage", String.class);

            //column(s)
            CrosstabColumnGroupBuilder<String> columnTripTypeGroup = ctab.columnGroup("tripType", String.class);

            //measure(s)
            CrosstabMeasureBuilder<Long> tripTypeMeasure = ctab.measure("Count", "id", Long.class, Calculation.COUNT);
            CrosstabMeasureBuilder<BigDecimal> receiptAmountMeasure = ctab.measure("Amout Paid", "receiptAmount", BigDecimal.class, Calculation.SUM);

            CrosstabBuilder crosstab = ctab.crosstab()
                    .setDataPreSorted(true)
                    .setCellWidth(110)
                    .headerCell(cmp.text("Depart Date / Trip Type / Trip Coverage").setStyle(Templates.boldCenteredStyle))
                    .rowGroups(
                            rowDepartureYearMonthGroup, rowDepartureDateGroup, rowTripCoverageGroup)
                    .columnGroups(
                            columnTripTypeGroup)
                    .measures(
                            tripTypeMeasure, receiptAmountMeasure);

            try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
                report()
                        .fields(field("id", Long.class), field("tripType", String.class), 
                                field("tripCoverage", String.class), field("departureTime", Date.class))
                        .setPageFormat(PageType.A4, PageOrientation.LANDSCAPE)
                        .setTemplate(Templates.reportTemplate)
                        .title(Templates.createTitleComponent("XTab By Trip Type By Coverage"))
                        .pageFooter(Templates.footerComponent)
                        .sortBy(asc(field("tripCoverage", String.class)), asc(field("departureTime", Date.class)))
                        .setDataSource(ds)
                        .summary(crosstab)
                        .toXls(os);
                return os.toByteArray();
            } catch (Exception ex) {
                logger.error("Error: {}", ex.getLocalizedMessage());
            }
        }

        return null;
    }
    
    
    @Override
    public byte[] xTabByTripTypeByTripDestination(Date startDate, Date endDate) {

        //collect data from departures
        List<TerminalPass> tps = basicReportService.findDeparturesBetweenDates(startDate, endDate);
        logger.info("Found {} rows.", tps.size());
        if (!tps.isEmpty()) {

            //set uo data source 
            JRDataSource ds = new JRBeanCollectionDataSource(tps);

            //row(s)
            CrosstabRowGroupBuilder<String> rowDepartureYearMonthGroup = ctab.rowGroup(new DepartureYearMonthExpression())
                    .setHeaderWidth(80);
            CrosstabRowGroupBuilder<String> rowDepartureDateGroup = ctab.rowGroup(new DepartureDateExpression())
                    .setHeaderWidth(80);
            CrosstabRowGroupBuilder<String> rowTripDestinationGroup = ctab.rowGroup("tripDestination", String.class);

            //column(s)
            CrosstabColumnGroupBuilder<String> columnTripTypeGroup = ctab.columnGroup("tripType", String.class);

            //measure(s)
            CrosstabMeasureBuilder<Long> tripTypeMeasure = ctab.measure("Count", "id", Long.class, Calculation.COUNT);
            CrosstabMeasureBuilder<BigDecimal> receiptAmountMeasure = ctab.measure("Amout Paid", "receiptAmount", BigDecimal.class, Calculation.SUM);

            CrosstabBuilder crosstab = ctab.crosstab()
                    .setDataPreSorted(true)
                    .setCellWidth(110)
                    .headerCell(cmp.text("Depart Date / Trip Type / Trip Destination").setStyle(Templates.boldCenteredStyle))
                    .rowGroups(
                            rowDepartureYearMonthGroup, rowDepartureDateGroup, rowTripDestinationGroup)
                    .columnGroups(
                            columnTripTypeGroup)
                    .measures(
                            tripTypeMeasure, receiptAmountMeasure);

            try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
                report()
                        .fields(field("id", Long.class), field("tripType", String.class), 
                                field("tripDestination", String.class), field("departureTime", Date.class))
                        .setPageFormat(PageType.A4, PageOrientation.LANDSCAPE)
                        .setTemplate(Templates.reportTemplate)
                        .title(Templates.createTitleComponent("XTab By Trip Type By Destination"))
                        .pageFooter(Templates.footerComponent)
                        .sortBy(asc(field("tripDestination", String.class)), asc(field("departureTime", Date.class)))
                        .setDataSource(ds)
                        .summary(crosstab)
                        .toXls(os);
                return os.toByteArray();
            } catch (Exception ex) {
                logger.error("Error: {}", ex.getLocalizedMessage());
            }
        }

        return null;
    }
    

    private class DepartureYearMonthExpression extends AbstractSimpleExpression<String> {

        private static final long serialVersionUID = 1L;

        @Override
        public String evaluate(ReportParameters reportParameters) {
            SimpleDateFormat sf = new SimpleDateFormat("yyy-MMM");
            return sf.format((Date) reportParameters.getValue("departureTime"));
        }

    }

    private class DepartureDateExpression extends AbstractSimpleExpression<String> {

        private static final long serialVersionUID = 1L;

        @Override
        public String evaluate(ReportParameters reportParameters) {
            SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd");
            return sf.format((Date) reportParameters.getValue("departureTime"));
        }
    }

}
