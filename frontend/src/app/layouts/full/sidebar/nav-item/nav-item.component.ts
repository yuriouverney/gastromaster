import { Component, ElementRef, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { NavItem } from './nav-item';
import { Router, ActivatedRoute } from '@angular/router';
import { NavService } from '../../../../services/nav.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: [],
})
export class AppNavItemComponent implements OnChanges, OnDestroy {
  @Input() item: NavItem | any;
  @Input() depth: any;
  private subscription: Subscription;
  @Input() permission: string | null = null;

  @ViewChild('AppIndexComponent') AppIndexComponent: ElementRef;

  constructor(
    public navService: NavService,
    public router: Router,
    private authService: AuthService,
    private scrollService: ScrollService,
    private route: ActivatedRoute
  ) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }
  ngOnInit(): void {
    this.subscription = this.authService.permission$.subscribe((permission) => {
      if (permission === null) {
        this.subscription = this.authService.permission$.subscribe((permission) => {
          this.permission = permission ? permission.toString() : null;
        });
      }
      this.permission = permission ? permission.toString() : null;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  hasPermission(item: NavItem): boolean {
    if (!item.permissions || item.permissions.length === 0) {
      return true;
    }

    return item.permissions.includes(this.permission || '');
  }

  ngOnChanges() {
    this.navService.currentUrl.subscribe();
  }

  onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      if (this.route.snapshot.url.toString() === item.route) {
        if (item.sectionId) {
          this.scrollService.scrollToSection(item.sectionId);
        }
      } else {
        this.router.navigate([item.route]).then(() => {
          if (item.sectionId) {
            this.scrollService.scrollToSection(item.sectionId);
          }
        });
      }
    }

    // scroll
    document.querySelector('.page-wrapper')?.scroll({
      top: -80,
      left: 0,
    });
  }
}
