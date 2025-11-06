import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Login } from './login';

describe('Login (zoneless)', () => {
  let fixture: any;
  let loginComponent: Login;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, Login],
      providers: [provideZonelessChangeDetection()],
    })
      .overrideComponent(Login, { set: { template: '', imports: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(Login);
    loginComponent = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true as any);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('creates and starts with invalid form', () => {
    expect(loginComponent).toBeTruthy();
    expect(loginComponent.loginForm.valid).toBeFalse();
  });

  it('onSubmit skips HTTP and navigation when form is invalid', () => {
    loginComponent.onSubmit();
    httpMock.expectNone('/api/login');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('onSubmit posts credentials, stores session, and navigates on success', () => {
    loginComponent.loginForm.setValue({ loginId: 'alice@example.com', password: 'pw' });

    loginComponent.onSubmit();

    const req = httpMock.expectOne((r) => r.method === 'POST' && r.url === '/api/login');
    expect(req.request.body).toEqual({
      Name: 'alice@example.com',
      Password: 'pw',
      Email: 'alice@example.com',
    });

    req.flush({ token: 't123', username: 'alice', id: '7', email: 'alice@example.com' });

    expect(localStorage.getItem('token')).toBe('t123');
    expect(localStorage.getItem('user')).toBe('alice');
    expect(localStorage.getItem('userId')).toBe('7');
    expect(localStorage.getItem('email')).toBe('alice@example.com');
    expect(router.navigate).toHaveBeenCalledWith(['/menu']);
  });

  it('onSubmit handles HTTP error without setting storage or navigating', () => {
    loginComponent.loginForm.setValue({ loginId: 'bob@example.com', password: 'bad' });

    loginComponent.onSubmit();

    const req = httpMock.expectOne('/api/login');
    req.flush({ message: 'unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(localStorage.getItem('token')).toBeNull();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
