export class Helpers {
  public static removeDefinitionsRef(value: string = ''): string {
    const result = value.replace('#/components/schemas/', '');
    return result;
  }
}
