export class Helpers {
  public static removeDefinitionsRef(value: string = ''): string {
    const result = value.replace('#/definitions/', '');
    return result;
  }
}
