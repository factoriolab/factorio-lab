import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Mocks, TestUtility } from 'src/tests';
import { DatasetState } from '~/store/dataset';
import { IconComponent } from '../icon/icon.component';
import { RankerComponent } from './ranker.component';

@Component({
  selector: 'lab-test-ranker',
  template: `
    <lab-ranker
      [data]="data"
      [rank]="rank"
      [options]="options"
      (cancel)="cancel()"
      (preferItem)="preferItem($event)"
      (dropItem)="dropItem($event)"
    >
    </lab-ranker>
  `,
})
class TestRankerComponent {
  @ViewChild(RankerComponent) child: RankerComponent;
  data: DatasetState = Mocks.Data;
  rank = [];
  options = [];
  cancel() {}
  preferItem(data) {}
  dropItem(data) {}
}

describe('RankerComponent', () => {
  let component: TestRankerComponent;
  let fixture: ComponentFixture<TestRankerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IconComponent, RankerComponent, TestRankerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRankerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set opening to false on first click event', () => {
    spyOn(component, 'cancel');
    document.body.click();
    expect(component.cancel).not.toHaveBeenCalled();
    expect(component.child.opening).toEqual(false);
  });

  it('should cancel when clicked away', () => {
    spyOn(component, 'cancel');
    component.child.opening = false;
    document.body.click();
    expect(component.cancel).toHaveBeenCalled();
  });

  it('should not cancel when clicked on', () => {
    spyOn(component, 'cancel');
    component.child.opening = false;
    TestUtility.clickSelector(fixture, 'lab-ranker');
    expect(component.cancel).not.toHaveBeenCalled();
  });
});
