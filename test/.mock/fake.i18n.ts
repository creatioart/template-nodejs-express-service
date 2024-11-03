export class FakeI18n {
  public getLocale(): string {
    return '';
  }

  public getLocales(): string[] {
    return [];
  }

  public setLocale(_: string): void {
  }

  public __(key: string, _?: any): string {
    return key;
  }

  public __n(phrase: string, _: number): string {
    return phrase;
  }
}
