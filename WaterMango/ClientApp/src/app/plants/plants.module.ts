import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlantListComponent } from './plant-list/plant-list.component';
import { WaterButtonComponent } from './water-button/water-button.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PlantListComponent, WaterButtonComponent],
})
export class PlantsModule { }
