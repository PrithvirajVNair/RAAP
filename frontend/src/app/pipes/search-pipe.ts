import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {

  transform(companyUsers: any[], searchKey:string): any[] {
    console.log(searchKey);
    
    let result:any =[]
    if(!companyUsers || searchKey==""){
      return companyUsers
    }
    result = companyUsers.filter((item:any)=>item.username.toLowerCase().includes(searchKey.toLowerCase()))
    return result
  }

}
