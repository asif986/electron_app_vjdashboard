import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ExcelService } from 'src/app/shared/excel.service';
import { HelperService } from 'src/app/shared/helper.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-excelimport',
  templateUrl: './excelimport.component.html',
  styleUrls: ['./excelimport.component.css']
})
export class ExcelimportComponent implements OnInit {

  // Excel sheet import 

  @Output() excelImportEvent = new EventEmitter<any>();

  spinnerEnabled = false;

  keys: string[];

  dataSheet = new Subject();

  @ViewChild('filePick') inputFile: ElementRef;

  isExcelFile: boolean;

  constructor(
    public helper: HelperService,
    public excelService:ExcelService
  ) { }

  ngOnInit(): void {
  }

  /**
 * Determines whether change excel import on
 * @param evt 
 */
  onChangeExcelImport(evt: any) {

    console.log(evt);
    let data, header;
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (target.files.length > 1) {
      this.inputFile.nativeElement.value = '';
    }
    if (this.isExcelFile) {
      this.excelService.isexcelImportSpinner.next(true);
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        data = XLSX.utils.sheet_to_json(ws);
      };

      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = (e) => {
        this.spinnerEnabled = false;
        this.keys = Object.keys(data[0]);

        this.dataSheet.next(data);
      }

      this.dataSheet.subscribe(res => {

        console.log(this.keys);
        console.log(res);
        this.excelImportEvent.emit(res);
      });
    } else {
      this.excelService.isexcelImportSpinner.next(false);
      // this.spinnerEnabled = false;
      this.helper.newopenAlertBox('error', 'This is not an Excel file. Please upload the Excel file')
      this.inputFile.nativeElement.value = '';
    }
  }

}
