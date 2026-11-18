import { registerDecorator, ValidationOptions } from 'class-validator';

/** bcrypt учитывает только первые 72 байта, а не символа: кириллица занимает 2 байта. */
export function MaxBytes(max: number, options?: ValidationOptions) {
  return (target: object, propertyName: string) =>
    registerDecorator({
      name: 'maxBytes',
      target: target.constructor,
      propertyName,
      options: {
        message: `${propertyName} must not exceed ${max} bytes`,
        ...options,
      },
      validator: {
        validate: (value: unknown) =>
          typeof value === 'string' && Buffer.byteLength(value, 'utf8') <= max,
      },
    });
}
