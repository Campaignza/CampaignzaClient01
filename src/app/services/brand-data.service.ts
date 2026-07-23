import { Injectable } from '@angular/core';
import { supabaseConfig } from '../config/supabase.config';

export interface BrandData {
  id: string;
  brand_name: string;
  brand_photo_url: string | null;
  website_url: string | null;
  gmb_profile_url: string | null;
  gmb_review_texts: string[] | null;
  gmb_review_texts_hi: string[] | null;
  gmb_review_texts_mr: string[] | null;
  whatsapp_no: string | null;
  whatsapp_msg_text: string | null;
}

@Injectable({ providedIn: 'root' })
export class BrandDataService {
  private readonly endpoint = `${supabaseConfig.url}/rest/v1/brand_data`;

  async getActiveBrand(): Promise<BrandData> {
    if (supabaseConfig.anonKey.startsWith('REPLACE_')) {
      throw new Error('Supabase publishable key has not been configured.');
    }

    const query = new URLSearchParams({
      select: [
        'id',
        'brand_name',
        'brand_photo_url',
        'website_url',
        'gmb_profile_url',
        'gmb_review_texts',
        'gmb_review_texts_hi',
        'gmb_review_texts_mr',
        'whatsapp_no',
        'whatsapp_msg_text',
      ].join(','),
      brand_name: `eq.${supabaseConfig.brandName}`,
      is_active: 'eq.true',
      limit: '1',
    });

    const response = await fetch(`${this.endpoint}?${query.toString()}`, {
      headers: {
        apikey: supabaseConfig.anonKey,
        Authorization: `Bearer ${supabaseConfig.anonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Supabase returned HTTP ${response.status}.`);
    }

    const brands = (await response.json()) as BrandData[];
    if (!brands.length) {
      throw new Error(`No active brand found for ${supabaseConfig.brandName}.`);
    }

    return brands[0];
  }
}
