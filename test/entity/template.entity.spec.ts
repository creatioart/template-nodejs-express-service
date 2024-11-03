import * as mocha from 'mocha';
import Container from 'typedi';
import {Template} from '../../src/entity/template';
import {LocaleService} from '@creatioart-js/express-core';
import {FakeI18n} from '../.mock/fake.i18n';

// Import Chai
let expect: Chai.ExpectStatic;
before(async () => {
    expect = (await import('chai')).expect;
});

mocha.describe('Template Test', () => {
  /**
   * Init Test
   */
  Container.set(LocaleService, new LocaleService(new FakeI18n()));

  mocha.it('Template Constructor', () => {
    const instance = new Template();

    expect(instance.id).equal(undefined);
    expect(instance.name).equal('');
    expect(instance.description).equal('');
  });

  mocha.it('Template Validation', async () => {
    const instance = new Template();
    const validation = await Template.validate(instance);

    expect(validation).not.equal(undefined);
    expect(validation?.status ?? 0).equal(422);
    expect((validation as any).entityTypeName ?? '').equal('Template');
  });

  mocha.it('Template Validation', async () => {
    const instance = new Template();
    const validation = await instance.validate();

    expect(validation).not.equal(undefined);
    expect(validation?.status ?? 0).equal(422);
    expect((validation as any).entityTypeName ?? '').equal('Template');
  });

  mocha.it('Template PlainToClass', async () => {
    const instance = Template.build().plainToClass({
      name : ' abc abc  abc '
    });

    expect(instance).not.equal(undefined);
    expect(instance.id).equal(0);
    expect(instance.name).equal('abc abc abc');
    expect(instance.description).equal('');
  });

  mocha.it('Template ClassToClass', async () => {
    const instance1 = Template.build().plainToClass({
      name : '123',
      description: ' abc abc  abc '
    });
    const instance2 = Template.build().classToClass(new Template(1, '123', 'abc abc abc'));

    expect(instance2).not.equal(undefined);
    expect(instance2.name).equal(instance1.name);
    expect(instance2.description).equal(instance1.description);
  });
});
