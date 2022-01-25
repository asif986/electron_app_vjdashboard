import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver'
import { BehaviorSubject } from 'rxjs';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  isexcelImportSpinner = new BehaviorSubject<boolean>(false);
  isexcelExportSpinner = new BehaviorSubject<boolean>(false);

  constructor(
    public helper: HelperService
  ) { }


  exportexcel(fnm, columns, data): void {


    //  return  console.log(this.filterData);
    this.helper.loadingIndicatorBox('Excelsheet importing in progress..');
    let workbook = new Workbook();
    let d = new Date();

    let worksheet = workbook.addWorksheet('VJAttendance');
    let filename = `vjattednance-${fnm}.xlsx`;

    worksheet.columns = columns;

    // {
    //   name: e.name, office: e.office_name, department_name: e.department_name, farvision_id: e.farvision_id, main_requests_id: e.work_area,
    //   location: e.location, remark: e.remark, date: e.date, intime: e.intime == "-" ? '-' : e.intime, outtime: e.outtime == "-" ? '-' : e.outtime, total: e.total
    // }

    data.forEach(e => {
      worksheet.addRow(e, "n");
    });

    const row = worksheet.getRow(1);
    row.font = { name: 'Popins', size: 12, bold: true };

    workbook.xlsx.writeBuffer().then((data) => {
      setTimeout(() => {

        this.helper.dismissloadingIndicatorBox();
      }, 500);
      //  this.helper.newopenAlertBox('success','File export successfully');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, filename);
    });

  }


}
