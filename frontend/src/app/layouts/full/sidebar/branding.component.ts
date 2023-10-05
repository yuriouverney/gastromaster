import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-branding',
  template: `
    <div class="branding">
      <a href="/">
        <img [src]="logo" alt="logo" />
      </a>
    </div>
  `,
})
export class BrandingComponent implements OnInit {
  constructor(private imageService: ImageService) {}

  logo: string;

  ngOnInit(): void {
    this.getLogosFromIndexedDb();
  }

  async getLogosFromIndexedDb() {
    const savedLogo = await this.imageService.getImage('logo');
    this.logo = URL.createObjectURL(savedLogo);
  }
}
