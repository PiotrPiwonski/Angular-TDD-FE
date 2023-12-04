import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import { SignUpComponent } from './sign-up.component';
import {SharedModule} from "../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SignUpComponent
      ],
      imports: [
        HttpClientTestingModule,
        SharedModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Layout', () => {
    it('has Sign Up header', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const h1 = signUp.querySelector('h1');
      expect(h1?.textContent).toBe('Sign Up');
    });

    it('has username input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const label = signUp.querySelector('label[for="username"]');
      const input = signUp.querySelector('input[id="username"]');
      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label?.textContent).toContain('Username');
    });

    it('has email input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const label = signUp.querySelector('label[for="email"]');
      const input = signUp.querySelector('input[id="email"]');
      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label?.textContent).toContain('E-mail');
    });

    it('has password input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const label = signUp.querySelector('label[for="password"]');
      const input = signUp.querySelector('input[id="password"]');
      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label?.textContent).toContain('Password');
    });

    it('has password type for password input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const input = signUp.querySelector('input[id="password"]') as
        HTMLInputElement;
      expect(input.type).toBe('password');
    });

    it('has password repeat input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const label = signUp.querySelector('label[for="passwordRepeat"]');
      const input = signUp.querySelector('input[id="passwordRepeat"]');
      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label?.textContent).toContain('Password Repeat');
    });

    it('has password type for password repeat input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const input = signUp.querySelector('input[id="passwordRepeat"]') as
        HTMLInputElement;
      expect(input.type).toBe('password');
    });

    it('has Sign Up button', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const button = signUp.querySelector('button');
      expect(button?.textContent).toContain('Sign Up');
    });

    it('disabled the input initially', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const button = signUp.querySelector('button');
      expect(button?.disabled).toBeTruthy();
    });
  });

  describe('Interaction', () => {

    let button: any;
    let httpTestingController: HttpTestingController;
    let signUp: HTMLElement;

    const setupForm = async () => {
      httpTestingController = TestBed.inject(HttpTestingController);
      signUp = fixture.nativeElement as HTMLElement;

      await fixture.whenStable();
      const usernameInput = signUp
        .querySelector('input[id="username"]') as HTMLInputElement;
      const emailInput = signUp
        .querySelector('input[id="email"]') as HTMLInputElement;
      const passwordInput = signUp
        .querySelector('input[id="password"]') as HTMLInputElement;
      const passwordRepeatInput = signUp
        .querySelector('input[id="passwordRepeat"]') as HTMLInputElement;
      usernameInput.value = 'user1';
      usernameInput.dispatchEvent(new Event('input'));
      emailInput.value = 'user1@mail.com';
      emailInput.dispatchEvent(new Event('input'));
      passwordInput.value = 'P4ssword';
      passwordInput.dispatchEvent(new Event('input'));
      passwordRepeatInput.value = 'P4ssword';
      passwordRepeatInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      button = signUp.querySelector('button');
    };

    it('enables the button when the password and password repeat fields have same value', async () => {
      await setupForm();
      expect(button?.disabled).toBeFalsy();
    });

    it('sends username, email and password after clicking the button', async () => {
      // const spy = spyOn(window, 'fetch');
      await setupForm();
      button?.click();
      const req = httpTestingController.expectOne('/api/1.0/users');
      const requestBody = req.request.body;

      // const args = spy.calls.allArgs()[0];
      // const secondParam = args[1] as RequestInit;
      // expect(secondParam.body).toEqual(JSON.stringify({
      //   username: 'user1',
      //   email: 'user1@mail.com',
      //   password: 'P4ssword'
      // }));

      expect(requestBody).toEqual({
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword'
      });
    });

    it('disables button when there is an ongoing api call', async() => {
      await setupForm();
      button?.click();
      fixture.detectChanges();
      button?.click();
      httpTestingController.expectOne('/api/1.0/users');
      expect(button.disabled).toBeTruthy();
    });

    it('displays spinner after clicking the submit', async() => {
      await setupForm();
      expect(signUp.querySelector('span[role="status"]')).toBeFalsy();
      button?.click();
      fixture.detectChanges();
      expect(signUp.querySelector('span[role="status"]')).toBeTruthy();
    });

    it('displays account activation notification after successful sign up request', async () => {
      await setupForm();
      expect(signUp.querySelector('.alert-success')).toBeFalsy();
      button?.click();
      const req = httpTestingController.expectOne('/api/1.0/users');
      req.flush({});
      fixture.detectChanges();
      const message = signUp.querySelector('.alert-success');
      expect(message?.textContent)
        .toContain('Please check your e-mail to activation your account');
    });

    it('hides sign up form after successful sign up request', async () => {
      await setupForm();
      expect(signUp.querySelector('div[data-testid="form-sign-up"]'))
        .toBeTruthy();
      button?.click();
      const req = httpTestingController.expectOne('/api/1.0/users');
      req.flush({});
      fixture.detectChanges();
      expect(signUp.querySelector('div[data-testid="form-sign-up"]'))
        .toBeFalsy();
    });
  });

  describe('Validation', () => {

    const testCase = [
      {field: 'username', value: '', error: 'Username is required'},
      {field: 'username', value: '123', error: 'Username must be at least 4 characters long'},
    ];

    testCase.forEach(({field, value, error}) => {
      it(`displays ${error} when ${field} has '${value}'`, () => {
        const signUp = fixture.nativeElement as HTMLElement;
        expect(signUp
          .querySelector(`div[data-testid="${field}-validation"]`)).toBeNull();
        const input = signUp
          .querySelector(`input[id="${field}"]`) as HTMLInputElement;
        input.value = value;
        input.dispatchEvent(new Event('input'));
        input.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        const validationElement = signUp
          .querySelector(`div[data-testid="${field}-validation"]`);
        expect(validationElement?.textContent)
          .toContain(error);
      });
    });

  });

});

