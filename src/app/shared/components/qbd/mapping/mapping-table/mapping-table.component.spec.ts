// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { MappingTableComponent } from './mapping-table.component';
// import { postMappingResponse } from 'src/app/integrations/qbd/qbd-main/qbd-mapping/qbd-generic-mapping/qbd-generic-mapping.fixture';
// import { OperatingSystem } from 'src/app/core/models/enum/enum.model';

// describe('MappingTableComponent', () => {
//   let component: MappingTableComponent;
//   let fixture: ComponentFixture<MappingTableComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [ MappingTableComponent ]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(MappingTableComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('onTextBoxChange function check', () => {
//     const event = {
//       target: {
//         value: 'fyle'
//       }
//     };
//     expect(component.onTextBoxChange(event)).toBeUndefined();
//     expect(component.destinationValue).toEqual(event.target.value);
//   });

//   it('isTypingInBox function check', () => {
//     const event = {
//       keyCode: 13
//     };
//     component.destinationValue = '';
//     expect(component.isTypingInBox(event, postMappingResponse)).toBeUndefined();
//     expect(component.focussedMappingId).toEqual(0);
//     expect(postMappingResponse.destination_value).toBeNull();

//     component.destinationValue = 'kjkjkj';
//     expect(component.isTypingInBox(event, postMappingResponse)).toBeUndefined();
//     expect(component.focussedMappingId).toEqual(0);
//     expect(postMappingResponse.destination_value).toEqual(component.destinationValue);

//     const event1 = {
//       keyCode: 1
//     };
//     expect(component.isTypingInBox(event1, postMappingResponse)).toBeUndefined();
//     expect(component.focussedMappingId).toEqual(postMappingResponse.id);
//   });

//   it('getToolTipText function check', () => {
//     const result1 = `
//             <div style="padding:0px 6px 4px;text-align: center;>
//               <p style="font-size:12px;padding-top:0">Save</p>
//               <p style="margin-top:5px;padding:4px;background: #A9ACBC80;font-size:10px;border-radius: 4px;">return<p>
//             </div>`;
//     const result2 = `
//             <div style="padding:0px 6px 4px;text-align: center;>
//               <p style="font-size:12px;padding-top:0">Save</p>
//               <p style="margin-top:5px;padding:4px;background: #A9ACBC80;font-size:10px;border-radius: 4px;">⏎<p>
//             </div>`;
//     component.operatingSystem = OperatingSystem.MAC;
//     expect(component.getToolTipText()).toEqual(result1);
//     component.operatingSystem = OperatingSystem.WIN;
//     expect(component.getToolTipText()).toEqual(result2);
//   });
// });
