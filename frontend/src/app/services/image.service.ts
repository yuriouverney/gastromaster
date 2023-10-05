import { Injectable } from '@angular/core';
import { openDB } from 'idb';
import { SettingService } from './setting.service';
import { Observable, Subject, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private settingService: SettingService) {}
  private dbPromise = openDB('MyDatabase', 1, {
    upgrade(db) {
      db.createObjectStore('images');
    },
  });
  private imagesLoadedSubject: Subject<void> = new Subject<void>();
  imagesLoaded$ = this.imagesLoadedSubject.asObservable();

  async saveImage(key: string, blob: Blob) {
    const db = await this.dbPromise;
    await db.put('images', blob, key);
  }

  async getImage(key: string) {
    const db = await this.dbPromise;
    return await db.get('images', key);
  }

  async loadImages() {
    this.settingService.getImages().subscribe(async (data) => {
      for (const item of data) {
        const arrayBuffer = new Uint8Array(item.buffer.data).buffer;
        const blob = new Blob([arrayBuffer]);
        await this.saveImage(item.image, blob);
      }
      this.imagesLoadedSubject.next();
      this.imagesLoadedSubject.complete();
    });
  }

  getLogo(): Observable<string> {
    return from(this.getImage('logo')).pipe(map((savedLogo) => URL.createObjectURL(savedLogo)));
  }
}
