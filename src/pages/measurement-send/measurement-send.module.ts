import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeasurementSendPage } from './measurement-send';

@NgModule({
  declarations: [
    MeasurementSendPage,
  ],
  imports: [
    IonicPageModule.forChild(MeasurementSendPage),
  ],
})
export class MeasurementSendPageModule {}
