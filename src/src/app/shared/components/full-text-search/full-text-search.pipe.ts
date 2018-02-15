import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'fullTextSearch',
    pure: false
})
export class FullTextSearchPipe implements PipeTransform {
    transform(value: any, query: string, field?: string) {
        return query ? value.reduce((prev, next) => {
            if (next[field].toLowerCase().includes(query)) {
                prev.push(next);
            }
            return prev;
        }, []) : value;
    }
}
