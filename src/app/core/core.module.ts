import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * CoreModule - Contains singleton services and app-wide functionality
 * 
 * Architecture:
 * - Import once in AppModule
 * - Contains all services that should be singleton
 * - Prevents re-importing with guard
 */
@NgModule({
  imports: [CommonModule],
  providers: []
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
    }
  }
}
