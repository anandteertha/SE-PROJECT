import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { passwordsMatchValidator, Register } from './register';

describe('Register (zoneless)', () => {
  let fixture: any;
  let registerComponent: Register;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, Register],
      providers: [provideZonelessChangeDetection()],
    })
      .overrideComponent(Register, { set: { template: '', imports: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(Register);
    registerComponent = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true as any);

    fixture.detectChanges();
  });

  it('creates', () => {
    expect(registerComponent).toBeTruthy();
    expect(registerComponent.registerForm.invalid).toBeTrue();
  });

  it('onSubmit does nothing when form is invalid', () => {
    registerComponent.registerForm.get('name')?.setValue('');
    registerComponent.registerForm.get('email')?.setValue('');
    registerComponent.onSubmit();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('onSubmit posts when valid and then navigates to /login', () => {
    registerComponent.registerForm.setValue({
      name: 'Alice',
      username: 'alice',
      email: 'alice@example.com',
      password: 'Aa1!aaaaaaaa',
      confirmPassword: 'Aa1!aaaaaaaa',
      termsAccepted: true,
    });

    registerComponent.onSubmit();

    const req = httpMock.expectOne((r) => r.method === 'POST' && r.url === '/api/register');
    expect(req.request.body).toEqual({
      Name: 'Alice',
      Password: 'Aa1!aaaaaaaa',
      Email: 'alice@example.com',
    });
    req.flush({ ok: true });

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('passwordsMatchValidator returns null when empty or matching, error when different', () => {
    const emptyGroup = new FormGroup({
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
    });
    expect(passwordsMatchValidator(emptyGroup)).toBeNull();

    const matchGroup = new FormGroup({
      password: new FormControl('x'),
      confirmPassword: new FormControl('x'),
    });
    expect(passwordsMatchValidator(matchGroup)).toBeNull();

    const mismatchGroup = new FormGroup({
      password: new FormControl('x'),
      confirmPassword: new FormControl('y'),
    });
    expect(passwordsMatchValidator(mismatchGroup)).toEqual({ passwordsMismatch: true });
  });

  it('ngOnDestroy signals destroyed', () => {
    const spy = spyOn(registerComponent.destroyed, 'next').and.callThrough();
    registerComponent.ngOnDestroy();
    expect(spy).toHaveBeenCalledWith(true);
  });
});
