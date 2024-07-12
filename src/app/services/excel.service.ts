import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  // Leer archivo Excel y convertir a JSON
  public readExcelFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {

      const reader = new FileReader();

      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsBinaryString(file);

    });
  }

  

  // Convertir JSON a archivo Excel y descargar
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });

    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);

    // if (this.isMobile()) {
    //   const filePath = this.saveAs.externalDataDirectory + fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION;
    //   this.saveAs.writeFile(this.saveAs.externalDataDirectory, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION, data, { replace: true })
    //     .then(() => {
    //       console.log('Archivo guardado en:', filePath);
    //     })
    //     .catch(err => {
    //       console.error('Error al guardar el archivo:', err);
    //     });
    // } else {
    //   // En el navegador
    //   saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    // }

  }

  // private isMobile(): boolean {
  //   return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  // }

  
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
