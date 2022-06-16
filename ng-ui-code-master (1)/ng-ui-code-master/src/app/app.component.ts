import {
  Component,
  Input,
  NgZone,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from "@angular/core";
import { SharedService } from "./shared/shared.service";
import {
  Router,
  NavigationEnd,
  NavigationStart,
  ActivatedRoute,
} from "@angular/router";
import { AuthService } from "./core/service/auth.service";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { environment } from "@env/environment";
declare let gtag: Function;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  isUserLoggedIn: boolean = false;
  title = "HRX Cloud";
  showSpinner: boolean = false;
  spinnerSubscription: Subscription;
  constructor(
    private zone: NgZone,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService
  ) {
    //this.addGAScript();
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (
          !this.authService.isUserLoggedIn() ||
          event.url.indexOf("employee/registration/activation") != -1 ||
          event.url == "/" ||
          event.url.indexOf("/login") != -1 ||
          event.url.indexOf("/welcome") != -1
        ) {
          this.isUserLoggedIn = false;
        } else {
          this.isUserLoggedIn = true;
        }
        this.cdr.detectChanges();
      }
    });
    // this.router.events
    //   .pipe(filter((event) => event instanceof NavigationEnd))
    //   .subscribe((event: NavigationEnd) => {
    //     /** START : Code to Track Page View  */
    //     gtag("event", "page_view", {
    //       page_path: event.urlAfterRedirects,
    //     });
    //     /** END */
    //   });
  }
  ngOnInit() {
    this.spinnerSubscription = this.sharedService.loaderCounter.subscribe(
      (counter: boolean) => {
        this.showSpinner = counter;
        this.cdr.detectChanges();
      }
    );
  }
  ngOnDestroy() {
    this.spinnerSubscription?.unsubscribe();
  }
  getToastIcon(type) {
    switch (type) {
      case "error":
        return "fa-window-close";
      case "success":
        return "fa-check-square-o";
      case "warn":
        return "fa-exclamation-triangle";
    }
  }
  /** Add Google Analytics Script Dynamically */
  addGAScript() {
    let gtagScript: HTMLScriptElement = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src =
      "https://www.googletagmanager.com/gtag/js?id=" +
      environment.GA_TRACKING_ID;
    document.head.prepend(gtagScript);

    /** Disable automatic page view hit to fix duplicate page view count  **/
    gtag("config", environment.GA_TRACKING_ID, { send_page_view: false });
  }
}
