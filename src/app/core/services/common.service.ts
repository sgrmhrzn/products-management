import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
/**
 * Communicate with server for common information
 */
export class CommonService {
  constructor(private http: HttpClient) { }

  /**
   * Generetes new GUID 
   * @returns string
   */
  uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
  }

  /**
   * parse link header data from api response header
   * @param header string
   * @returns 
   */
  parse_link_header(header: string) {
    if (header.length == 0) {
      return;
    }

    let parts = header.split(',');
    var links = {} as any;
    parts.forEach(p => {
      let section = p.split(';');
      var url = section[0].replace(/<(.*)>/, '$1').trim();
      var name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;

    });
    return links;
  }

}
