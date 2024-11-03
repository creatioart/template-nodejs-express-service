import * as mocha from 'mocha';
import Container from 'typedi';
import {TemplateRequestDto} from '../../src/dto/template/template.request.dto';
import {LocaleService} from '@creatioart-js/express-core';
import {FakeI18n} from '../.mock/fake.i18n';

// Import Chai
let expect: Chai.ExpectStatic;
before(async () => {
    expect = (await import('chai')).expect;
});

mocha.describe('TemplateRequestDto Test', () => {
  /**
   * Init Test
   */
  Container.set(LocaleService, new LocaleService(new FakeI18n()));

  mocha.it('TemplateRequestDto Constructor', () => {
    const instance = new TemplateRequestDto();

    expect(instance.name).equal('');
    expect(instance.description).equal('');
  });

  mocha.it('TemplateRequestDto Validation', async () => {
    const instance = new TemplateRequestDto();
    const validation = await TemplateRequestDto.validate(instance);

    expect(validation).not.equal(undefined);
    expect(validation?.status ?? 0).equal(422);
    expect((validation as any).entityTypeName ?? '').equal('TemplateRequestDto');
  });

  mocha.it('TemplateRequestDto Validation', async () => {
    const instance = new TemplateRequestDto();
    const validation = await instance.validate();

    expect(validation).not.equal(undefined);
    expect(validation?.status ?? 0).equal(422);
    expect((validation as any).entityTypeName ?? '').equal('TemplateRequestDto');
  });

  mocha.it('TemplateRequestDto PlainToClass', async () => {
    const instance = TemplateRequestDto.build().plainToClass({
      name : ' abc abc  abc '
    });

    expect(instance).not.equal(undefined);
    expect(instance.name).equal('abc abc abc');
    expect(instance.description).equal('');
  });

  mocha.it('TemplateRequestDto ClassToClass', async () => {
    const instance1 = TemplateRequestDto.build().plainToClass({
      name : ' abc abc  abc ',
      description: '123'
    });
    const instance2 = TemplateRequestDto.build().classToClass(new TemplateRequestDto('abc abc abc', '123'));

    expect(instance2).not.equal(undefined);
    expect(instance2.name).equal(instance1.name);
    expect(instance2.description).equal(instance1.description);
  });
});
