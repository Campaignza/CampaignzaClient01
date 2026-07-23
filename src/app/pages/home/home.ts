import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly whatsappUrl =
    'https://wa.me/917058482135?text=Hello%20Omkar%2C%20I%20clicked%20the%20button!';

  onContinue(event: MouseEvent): void {
    event.preventDefault();

    const fbq = (window as Window & {
      fbq?: (...args: unknown[]) => void;
    }).fbq;
    fbq?.('track', 'Lead');

    window.setTimeout(() => {
      window.location.href = this.whatsappUrl;
    }, 400);
  }
}
