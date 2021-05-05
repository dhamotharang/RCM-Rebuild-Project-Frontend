import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor() { }

  public downloader(fileSource: any, fileName: string) {
    const downloadLink = document.createElement("a");

    downloadLink.href = fileSource;
    downloadLink.download = fileName;
    downloadLink.click(); 
  }
}
