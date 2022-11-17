import { NgModule } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio'
import {MatCheckboxModule} from '@angular/material/checkbox'; 

import { VisualizerComponent } from './components/visualizer/visualizer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const modules = [
  CommonModule,
  FormsModule,
  MatToolbarModule,
  MatButtonModule,
  MatSliderModule,
  MatTooltipModule,
  MatInputModule,
  MatCardModule,
  MatIconModule,
  MatRadioModule,
  MatCheckboxModule,
];

const components = [
  VisualizerComponent
];

@NgModule({
  declarations: components,
  imports: modules,
  exports: [
    ...modules,
    ...components
  ]
})
export class SharedModule { }
