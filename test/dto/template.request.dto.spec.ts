import {Container} from 'typedi';
import {TemplateRequestDto} from '../../src/dto/template/template.request.dto';
import {LocaleService} from '@creatioart-js/express-core';
import {FakeI18n} from '../.mock/fake.i18n';

describe('TemplateRequestDto Test', () => {
  /**
   * Init Test
   */
  Container.set(LocaleService, new LocaleService(new FakeI18n()));

  it('TemplateRequestDto Constructor', () => {
    const instance = new TemplateRequestDto();

    expect(instance.name).toEqual('');
    expect(instance.description).toEqual('');
  });

  it('TemplateRequestDto Validation', async () => {
    const instance = new TemplateRequestDto();
    const validation = await TemplateRequestDto.validate(instance);

    expect(validation).not.toEqual(undefined);
    expect(validation?.status ?? 0).toEqual(422);
    expect((validation as any).entityTypeName ?? '').toEqual('TemplateRequestDto');
  });

  it('TemplateRequestDto Validation', async () => {
    const instance = new TemplateRequestDto();
    const validation = await instance.validate();

    expect(validation).not.toEqual(undefined);
    expect(validation?.status ?? 0).toEqual(422);
    expect((validation as any).entityTypeName ?? '').toEqual('TemplateRequestDto');
  });

  it('TemplateRequestDto PlainToClass', async () => {
    const instance = TemplateRequestDto.build().plainToClass({
      name : ' abc abc  abc '
    });

    expect(instance).not.toEqual(undefined);
    expect(instance.name).toEqual('abc abc abc');
    expect(instance.description).toEqual('');
  });

  it('TemplateRequestDto ClassToClass', async () => {
    const instance1 = TemplateRequestDto.build().plainToClass({
      name : ' abc abc  abc ',
      description: '123'
    });
    const instance2 = TemplateRequestDto.build().classToClass(new TemplateRequestDto('abc abc abc', '123'));

    expect(instance2).not.toEqual(undefined);
    expect(instance2.name).toEqual(instance1.name);
    expect(instance2.description).toEqual(instance1.description);
  });
});
