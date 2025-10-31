import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Header } from '@modules/header/header';

describe('Header', () => {
  let headerComponent: Header;
  let headerComponentFixture: ComponentFixture<Header>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])]
    })
      .compileComponents();

    headerComponentFixture = TestBed.createComponent(Header);
    headerComponent = headerComponentFixture.componentInstance;
    router = TestBed.inject(Router);
    headerComponentFixture.detectChanges();
  });

  it('should create', () => {
    expect(headerComponent).toBeTruthy();
  });

  describe('redirect spec suite', () => {
    it('should redirect to the path given as a parameter', () => {
      const routerSpy = spyOn(router, 'navigateByUrl');
      headerComponent.redirect("settings");
      expect(routerSpy).toHaveBeenCalledWith("/settings")
    });
  });
});
