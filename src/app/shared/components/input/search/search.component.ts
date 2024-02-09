import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Input() form: FormGroup;

  @Input() placeholder: string;
  
  @Input() styleClasses: string = '';

  isSearchFocused: boolean;

  constructor() { }

  clearSearch(): void {
    this.form.controls.searchOption.setValue('');
  }

  ngOnInit(): void {
  }

}
