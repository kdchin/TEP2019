import { Injectable } from '@angular/core';

@Injectable()
export class FileUtil {

    constructor() { }

    isCSVFile(file) {
        return file.name.endsWith(".csv");
    }

    getHeaderArray(csvRecordsArr, tokenDelimeter) {
        let headers = csvRecordsArr[0].split(tokenDelimeter);
        let headerArray = [];
        for (let j = 0; j < headers.length; j++) {
            headerArray.push(headers[j]);
        }
        return headerArray;
    }

    validateHeaders(origHeaders, fileHeaaders) {
        if (origHeaders.length != fileHeaaders.length) {
            return false;
        }

        var fileHeaderMatchFlag = true;
        for (let j = 0; j < origHeaders.length; j++) {
            if (origHeaders[j] != fileHeaaders[j]) {
                fileHeaderMatchFlag = false;
                break;
            }
        }
        return fileHeaderMatchFlag;
    }

    validateSize(csvRecordsArray, tokenDelimeter) {
        if (csvRecordsArray.length === 0) {
            alert("csv is empty!");
            return false;
        }
        let columns = csvRecordsArray[0].split(tokenDelimeter).length;
        for (let i = 0; i < csvRecordsArray.length; i++) {
            let row = csvRecordsArray[i].split(tokenDelimeter);
            let len = row.length;
            if (len !== 0 && !(len === 1 && row[0] === "") && len !== columns) {
                alert(`error: CSV at line ${i} expected to have ${columns} elements but has ${len}. Sometimes the csv reader has trouble reading fields and will think a line is shorter than it is. If this happens, edit the csv by retyping one entry and saving it, then try again.`)
                return false;
            }
        }
        return true;
    }

    getDataRecordsArrayFromCSVFile(csvRecordsArray, headerLength,
        validateHeaderAndRecordLengthFlag, tokenDelimeter) {
        var dataArr = []
        if (!this.validateSize(csvRecordsArray, tokenDelimeter)) return;

        for (let i = 0; i < csvRecordsArray.length; i++) {
            let data = csvRecordsArray[i].split(tokenDelimeter);
            if (!data || (data.length === 1 && data[0] === "")) continue; // skip blank lines
            let col = [];
            for (let j = 0; j < data.length; j++) {
                col.push(data[j]);
            }
            dataArr.push(col);
        }
        return dataArr;
    }

}
