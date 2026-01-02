"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scheduler_service_1 = require("../services/scheduler-service");
const router = (0, express_1.Router)();
/**
 * GET /download-full-agenda
 * Downloads the full irrigation schedule with times in the specified format
 * Query parameters:
 *   - year: Year for the schedule (defaults to current year)
 *   - fileFormat: Format of the file (pdf, xlsx, csv) - defaults to pdf
 */
router.get("/download-full-agenda", async (req, res, next) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const format = req.query.fileFormat || "pdf";
        if (format === "pdf") {
            const doc = (0, scheduler_service_1.generateSchedulePDF)(year);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=agua-vibora-${year}.pdf`);
            doc.pipe(res);
            doc.end();
        }
        else {
            const workbook = (0, scheduler_service_1.generateScheduleWorkbook)(year);
            if (format === "csv") {
                res.setHeader("Content-Type", "text/csv; charset=utf-8");
                res.setHeader("Content-Disposition", `attachment; filename=agua-vibora-${year}.csv`);
                await workbook.csv.write(res);
            }
            else {
                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", `attachment; filename=agua-vibora-${year}.xlsx`);
                await workbook.xlsx.write(res);
            }
            res.end();
        }
    }
    catch (error) {
        next(error);
    }
});
/**
 * GET /download-template
 * Downloads a blank template without irrigation times
 * Query parameters:
 *   - year: Year for the template (defaults to current year)
 *   - fileFormat: Format of the file (pdf, xlsx, csv) - defaults to xlsx
 */
router.get("/download-template", async (req, res, next) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const format = req.query.fileFormat || "xlsx";
        if (format === "pdf") {
            const doc = (0, scheduler_service_1.generateSchedulePDF)(year, true);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=agua-vibora-casais-${year}.pdf`);
            doc.pipe(res);
            doc.end();
        }
        else {
            const workbook = (0, scheduler_service_1.generateScheduleWorkbook)(year, true);
            if (format === "csv") {
                res.setHeader("Content-Type", "text/csv; charset=utf-8");
                res.setHeader("Content-Disposition", `attachment; filename=agua-vibora-casais-${year}.csv`);
                await workbook.csv.write(res);
            }
            else {
                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", `attachment; filename=agua-vibora-casais-${year}.xlsx`);
                await workbook.xlsx.write(res);
            }
            res.end();
        }
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map