import {Container} from 'typedi';
import {Template} from '../../src/entity/template';
import {LocaleService} from '@creatioart-js/express-core';
import {FakeI18n} from '../.mock/fake.i18n';

describe('Template Test', () => {
  /**
   * Init Test
   */
  Container.set(LocaleService, new LocaleService(new FakeI18n()));

  it('Template Constructor', () => {
    const instance = new Template();

    expect(instance.id).toEqual(undefined);
    expect(instance.name).toEqual('');
    expect(instance.description).toEqual('');
  });

  it('Template Validation', async () => {
    const instance = new Template();
    const validation = await Template.validate(instance);

    expect(validation).not.toEqual(undefined);
    expect(validation?.status ?? 0).toEqual(422);
    expect((validation as any).entityTypeName ?? '').toEqual('Template');
  });

  it('Template Validation', async () => {
    const instance = new Template();
    const validation = await instance.validate();

    expect(validation).not.toEqual(undefined);
    expect(validation?.status ?? 0).toEqual(422);
    expect((validation as any).entityTypeName ?? '').toEqual('Template');
  });

  it('Template PlainToClass', async () => {
    const instance = Template.build().plainToClass({
      name : ' abc abc  abc '
    });

    expect(instance).not.toEqual(undefined);
    expect(instance.id).toEqual(0);
    expect(instance.name).toEqual('abc abc abc');
    expect(instance.description).toEqual('');
  });

  it('Template ClassToClass', async () => {
    const instance1 = Template.build().plainToClass({
      name : '123',
      description: ' abc abc  abc '
    });
    const instance2 = Template.build().classToClass(new Template(1, '123', 'abc abc abc'));

    expect(instance2).not.toEqual(undefined);
    expect(instance2.name).toEqual(instance1.name);
    expect(instance2.description).toEqual(instance1.description);
  });
});
