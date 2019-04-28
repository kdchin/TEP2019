import { Pipe, PipeTransform } from '@angular/core';



@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if(!items) return [];
    if(!searchText) return items;
searchText = searchText.toLowerCase();


// check if first item in the list has the attribute first_name (then must be a teacher)
if(items[0].first_name)
    return items.filter(
    it => {
            return it.first_name.toLowerCase().includes(searchText) || it.last_name.toLowerCase().includes(searchText);
        })
   

// check if first item in the list has the attribute name (then must be a school)
if(items[0].name)
    return items.filter(
    it => {
           return it.name.toLowerCase().includes(searchText);
       })
  

if(items[0].shopping_date)
    return items.filter(
        it => {
            return it.teacher.first_name.toLowerCase().includes(searchText);
        });
    }}


// adapted from https://codeburst.io/create-a-search-pipe-to-dynamically-filter-results-with-angular-4-21fd3a5bec5c