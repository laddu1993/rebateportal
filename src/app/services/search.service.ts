import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchTerm: string = 'inprogress';
  private rebateType: string = '';
  private searchKeyword: string = '';
  constructor() {
    // Load the search term from local storage if it exists
    const savedTerm = localStorage.getItem('searchTerm');
    const savedType = localStorage.getItem('rebateType');
    const savedKeyword = localStorage.getItem('searchKeyword');

    if (savedTerm) {
      this.searchTerm = savedTerm;
    }
    if (savedType) {
      this.rebateType = savedType;
    }
    if (savedKeyword) {
      this.searchKeyword = savedKeyword;
    }
  }

  setSearchTerm(term: string) {
    this.searchTerm = term;
    localStorage.setItem('searchTerm', term);
  }

  setSearchType(term: string) {
    this.rebateType = term;
    localStorage.setItem('rebateType', term);
  }
  setsearchKeyword(term: string) {
    this.searchKeyword = term;
    localStorage.setItem('searchKeyword', term);
  }
  getSearchTerm(): string {
    return this.searchTerm;
  }

  getSearchType(): string {
    return this.rebateType;
  }
  getsearchKeyword(): string {
    return this.searchKeyword;
  }
  clearSearchTerm() {
    this.searchTerm = 'inprogress';
    this.rebateType = '';
    this.searchKeyword = '';
    localStorage.removeItem('searchTerm');
    localStorage.removeItem('rebateType');
    localStorage.removeItem('searchKeyword');
  }
}
