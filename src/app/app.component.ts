import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  constructor(private platform: Platform) {this.initializeApp();}

  initializeApp() {
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(9999, () => {
        console.log('Back button pressed');
        // Evitar el comportamiento predeterminado del botón de retroceso
        event.preventDefault();
        event.stopPropagation();
      });
    });
  }

}
