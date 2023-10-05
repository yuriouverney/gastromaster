import { Component, OnDestroy } from '@angular/core';
import { ImageService } from './services/image.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  isImagesLoaded = false;

  constructor(private imageService: ImageService) {
    this.imageService.loadImages();
    this.imageService.imagesLoaded$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.isImagesLoaded = true;
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
