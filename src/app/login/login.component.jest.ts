import {render, screen, waitFor} from '@testing-library/angular';
import userEvent from "@testing-library/user-event";
import {rest} from "msw";
import {setupServer} from "msw/node";
import {HttpClientModule} from "@angular/common/http";
import {SharedModule} from "../shared/shared.module";
import {LoginComponent} from "./login.component";
import {FormsModule} from "@angular/forms";


let requestBody: any;
let counter: number = 0;

const server = setupServer(
  rest.post('/api/1.0/auth',
    (req, res, ctx) => {
      requestBody = req.body
      counter += 1;
      if(requestBody.email === 'failing-user@mail.com') {
        return res(ctx.status(401), ctx.json({
          message: 'Incorrect Credentials'
        }))
      }
      return res(ctx.status(200), ctx.json({}))
    })
);

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

const setup = async () => {
  await render(LoginComponent, {
    // imports: [HttpClientTestingModule]
    imports: [
      HttpClientModule,
      SharedModule,
      FormsModule
    ]
  });
}

describe('LoginComponent', () => {

  describe('Layout', () => {
    it('has Login header', async () => {
      await setup();
      const header = screen.getByRole('heading', {name: 'Login'});
      expect(header).toBeInTheDocument();
    });

    it('has email input', async () => {
      await setup();
      expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    });

    it('has password input', async () => {
      await setup();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('has password type for password input', async () => {
      await setup();
      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('has Login button', async () => {
      await setup();
      const button = screen.getByRole('button', {name: 'Login'});
      expect(button).toBeInTheDocument();
    });

    it('disables the button initially', async () => {
      await setup();
      const button = screen.getByRole('button', {name: 'Login'});
      expect(button).toBeDisabled();
    });

  });

  describe('Interactions', () => {

    let button: any;

    const setupForm = async (values?: {email: string}) => {
      await setup();
      const emailInput = screen.getByLabelText('E-mail');
      const passwordInput = screen.getByLabelText('Password');
      await userEvent.type(emailInput, values?.email || 'user1@mail.com');
      await userEvent.type(passwordInput, 'P4ssword');
      button = screen.getByRole('button', {name: 'Login'});
    };

    it('enables the button when all the fields have valid input',
      async () => {
        await setupForm();
        expect(button).toBeEnabled();
      });

    it('sends email and password after clicking the button',
      async () => {
      await setupForm();
      await userEvent.click(button);

      await waitFor(() => {
        expect(requestBody).toEqual({
          email: 'user1@mail.com',
          password: 'P4ssword'
        });
      })
    });

    it('disables button when there is an ongoing api call',
      async () => {
        await setupForm();
        await userEvent.click(button);
        await userEvent.click(button);
        await waitFor(() => {
          expect(counter).toBe(1);
        });
    });

    it('displays spinner after clicking the submit', async () => {
      await setupForm();
      expect(screen.queryByRole('status', {hidden: true})).not.toBeInTheDocument();
      await userEvent.click(button);
      expect(screen.queryByRole('status', {hidden: true})).toBeInTheDocument();
    });

    it('displays validation error coming from backend after submit failure',
      async () => {
        await setupForm({email: 'failing-user@mail.com'});
        await userEvent.click(button);
        const errorMessage = await screen.findByText('Incorrect Credentials');
        expect(errorMessage).toBeInTheDocument();
    });

    it('hides spinner after Login request fails', async () => {
      await setupForm({email: 'failing-user@mail.com'});
      await userEvent.click(button);
      await screen.findByText('Incorrect Credentials');
      expect(screen.queryByRole('status', {hidden: true})).not.toBeInTheDocument();
    });
  });

});
