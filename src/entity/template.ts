import 'reflect-metadata';

import {IsNotEmpty, IsString, validate} from 'class-validator';
import {BaseEntity, BaseError, ClassNameGetter, ErrorStatus, StringHelper, ValidationOptionsDecorator, ValidationType,
        ValidatorHelper} from '@creatioart-js/express-core';
import {ErrorCode, ValidationError} from '@creatioart-js/express-error';
import {CoreServiceLocator} from '../locator/core.service.locator';

/**
 * Template Entity
 */
@ClassNameGetter
export class Template extends BaseEntity<Template> {
  /**
   * Update Field
   */
  public static CanUpdateField = [
    'name',
    'description'
  ];

  /**
   * Build factory method
   * @returns Instance
   */
  public static build() {
    return new this();
  }

  /**
   * Validate the instance
   * @param instance Template
   * @returns Base Error | undefined
   */
  public static async validate(instance: Template): Promise<BaseError | undefined> {
    const validationError: any = await validate(instance, {
      validationError: {target: false, value: false},
    });

    if (validationError.length > 0) {
      // Has error validation
      return new ValidationError(
        ErrorStatus.UNPROCESSABLE_ENTITY,
        CoreServiceLocator.LocaleService().translate('validation_errors'),
        ErrorCode.UNPROCESSABLE_ENTITY_BASE,
        this.Name,
        ValidatorHelper.getValidation(validationError)
      );
    }

    return undefined;
  }

  /**
   * Validate the instance
   * @returns Base Error | undefined
   */
  public override async validate(): Promise<BaseError | undefined> {
    return await Template.validate(this);
  }

  /**
   * Create class from Request
   * @param source Body Request
   * @returns Template
   */
  public override plainToClass(source: any): Template {
    const instance = new Template();

    if (source !== undefined) {
      instance.id = source.id ?? 0;
      instance.name = StringHelper.transformString(source.name);
      instance.description = StringHelper.transformString(source.description);
    }

    return instance;
  }

  /**
   * Create class from another class
   * @param source Template
   * @return Template
   */
  public override classToClass(source: Template): Template {
    const instance = new Template();

    if (source !== undefined) {
      instance.id = source.id;
      instance.name = source.name;
      instance.description = source.description;
    }

    return instance;
  }

  @IsString(ValidationOptionsDecorator(ValidationType.IS_STRING))
  @IsNotEmpty(ValidationOptionsDecorator(ValidationType.IS_NOT_EMPTY))
  public name: string;

  @IsString(ValidationOptionsDecorator(ValidationType.IS_STRING))
  public description: string;

  // Constructor Overloading
  constructor();
  constructor(id: number, name: string, description: string);
  constructor(id?: number, name?: string, description?: string) {
    super(id);
    this.name = name ?? '';
    this.description = description ?? '';
  }
}
