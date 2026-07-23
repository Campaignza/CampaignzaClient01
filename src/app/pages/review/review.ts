import { Component } from '@angular/core';

@Component({
  selector: 'app-review',
  imports: [],
  templateUrl: './review.html',
  styleUrl: './review.css',
})
export class Review {
  readonly reviewOptions = [
    'We had a wonderful experience with this brand. The team was professional, helpful, and made everything easy from start to finish. Highly recommended!',
    'Excellent service and a very friendly team. Everything was handled smoothly and professionally. I am very happy with the experience and would gladly recommend this brand.',
    'A reliable and trustworthy brand with great service. The team listened carefully, answered all our questions, and delivered a great overall experience.',
  ];

  readonly googleReviewUrl =
    // 'https://www.google.com/search?q=YOUR_BRAND_NAME+reviews';
    'https://www.google.com/search?q=Priyadarshani Training Center+reviews';

  currentOption = 0;
  copied = false;
  copyError = false;

  get currentReview(): string {
    return this.reviewOptions[this.currentOption];
  }

  showPrevious(): void {
    if (this.currentOption > 0) {
      this.currentOption -= 1;
      this.resetCopyStatus();
    }
  }

  showNext(): void {
    if (this.currentOption < this.reviewOptions.length - 1) {
      this.currentOption += 1;
      this.resetCopyStatus();
    }
  }

  async copyAndContinue(): Promise<void> {
    this.copyError = false;

    try {
      await navigator.clipboard.writeText(this.currentReview);
      this.copied = true;
    } catch {
      this.copyError = true;
    }

    const fbq = (window as Window & {
      fbq?: (...args: unknown[]) => void;
    }).fbq;
    fbq?.('track', 'Lead');

    window.setTimeout(() => {
      window.location.href = this.googleReviewUrl;
    }, 400);
  }

  private resetCopyStatus(): void {
    this.copied = false;
    this.copyError = false;
  }
}
