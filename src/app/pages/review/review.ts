import { Component, computed, inject, signal } from '@angular/core';
import { BrandData, BrandDataService } from '../../services/brand-data.service';

@Component({
  selector: 'app-review',
  imports: [],
  templateUrl: './review.html',
  styleUrl: './review.css',
})
export class Review {
  private readonly brandDataService = inject(BrandDataService);
  readonly brand = signal<BrandData | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly language = signal<'en' | 'hi' | 'mr'>('en');
  readonly currentOption = signal(0);
  readonly copied = signal(false);
  readonly copyError = signal(false);

  readonly reviewOptions = computed(() => {
    const currentBrand = this.brand();
    if (!currentBrand) return [];

    switch (this.language()) {
      case 'hi': return currentBrand.gmb_review_texts_hi ?? [];
      case 'mr': return currentBrand.gmb_review_texts_mr ?? [];
      default: return currentBrand.gmb_review_texts ?? [];
    }
  });

  get currentReview(): string {
    return this.reviewOptions()[this.currentOption()] ?? '';
  }

  get googleReviewUrl(): string {
    return this.brand()?.gmb_profile_url ?? '#';
  }

  constructor() {
    this.loadBrand();
  }

  selectLanguage(language: 'en' | 'hi' | 'mr'): void {
    this.language.set(language);
    this.currentOption.set(0);
    this.resetCopyStatus();
  }

  showPrevious(): void {
    if (this.currentOption() > 0) {
      this.currentOption.update((option) => option - 1);
      this.resetCopyStatus();
    }
  }

  showNext(): void {
    if (this.currentOption() < this.reviewOptions().length - 1) {
      this.currentOption.update((option) => option + 1);
      this.resetCopyStatus();
    }
  }

  async copyAndContinue(): Promise<void> {
    this.copyError.set(false);

    try {
      await navigator.clipboard.writeText(this.currentReview);
      this.copied.set(true);
    } catch {
      this.copyError.set(true);
    }

    const fbq = (window as Window & {
      fbq?: (...args: unknown[]) => void;
    }).fbq;
    fbq?.('track', 'Lead');

    window.setTimeout(() => {
      window.location.href = this.googleReviewUrl;
    }, 400);
  }

  private async loadBrand(): Promise<void> {
    try {
      this.brand.set(await this.brandDataService.getActiveBrand());
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Unable to load brand data.');
    } finally {
      this.loading.set(false);
    }
  }

  private resetCopyStatus(): void {
    this.copied.set(false);
    this.copyError.set(false);
  }
}
