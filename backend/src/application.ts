import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RestApplication} from '@loopback/rest';
import {RepositoryMixin} from '@loopback/repository';
import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {JWTAuthenticationStrategy} from '@loopback/authentication-jwt';
import path from 'path';
import {MySequence} from './sequence';
import {JWTService, MyUserService} from './services';
import {UserRepository, UserCredentialsRepository} from './repositories';

export {ApplicationConfig};

export class Backend extends BootMixin(RepositoryMixin(RestApplication)) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up bindings
    this.setUpBindings();

    // Add authentication component
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setUpBindings(): void {
    // Bind JWT & User services
    this.bind('services.jwt.service').toClass(JWTService);
    this.bind('services.user.service').toClass(MyUserService);
    
    // Bind token service for JWTAuthenticationStrategy
    this.bind('services.authentication.jwt.tokenservice').toClass(JWTService);

    // JWT secret and expiration
    this.bind('authentication.jwt.secret').to(process.env.JWT_SECRET || 'your-secret-key-change-this-in-production');
    this.bind('authentication.jwt.expiresIn').to(process.env.JWT_EXPIRES_IN || '7200');

    // Bind repositories
    this.bind('repositories.UserRepository').toClass(UserRepository);
    this.bind('repositories.UserCredentialsRepository').toClass(UserCredentialsRepository);
  }
}
