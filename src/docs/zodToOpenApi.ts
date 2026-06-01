import { ZodArray, ZodBoolean, ZodDefault, ZodEnum, ZodFile, ZodLiteral, ZodNullable, ZodNumber, ZodObject, ZodOptional, ZodString, ZodTypeAny } from 'zod';
import { OpenApiParameter } from '../types/internalTypes';

type OpenApiSchema = {
  type?: string;
  format?: string;
  enum?: Array<string | number>;
  nullable?: boolean;
  default?: unknown;
  description?: string;
  example?: unknown;
  properties?: Record<string, OpenApiSchema>;
  required?: string[];
  items?: OpenApiSchema;
  anyOf?: OpenApiSchema[];
};

type UnwrappedSchema = {
  schema: ZodTypeAny;
  optional: boolean;
  nullable: boolean;
  defaultValue?: unknown;
};

function unwrapSchema(schema: ZodTypeAny): UnwrappedSchema {
  let current: any = schema;
  let optional = false;
  let nullable = false;
  let defaultValue: unknown;

  while (true) {
    if (current instanceof ZodOptional) {
      optional = true;
      current = current.unwrap() as unknown as ZodTypeAny;
      continue;
    }

    if (current instanceof ZodNullable) {
      nullable = true;
      current = current.unwrap() as unknown as ZodTypeAny;
      continue;
    }

    if (current instanceof ZodDefault) {
      optional = true;
      defaultValue = (current as any)._def.defaultValue;
      current = (current as any)._def.innerType as ZodTypeAny;
      continue;
    }

    break;
  }

  return { schema: current as ZodTypeAny, optional, nullable, defaultValue };
}

function withMeta(schema: OpenApiSchema, unwrapped: UnwrappedSchema): OpenApiSchema {
  const next = { ...schema };

  if (unwrapped.nullable) {
    next.nullable = true;
  }

  if (typeof unwrapped.defaultValue !== 'undefined') {
    next.default = typeof unwrapped.defaultValue === 'function'
      ? unwrapped.defaultValue()
      : unwrapped.defaultValue;
  }

  return next;
}

function baseSchemaType(schema: ZodTypeAny): string {
  if (schema instanceof ZodString || schema instanceof ZodLiteral || schema instanceof ZodEnum || schema instanceof ZodFile) {
    return 'string';
  }

  if (schema instanceof ZodNumber) {
    return 'number';
  }

  if (schema instanceof ZodBoolean) {
    return 'boolean';
  }

  return 'string';
}

export function hasFileSchema(schema?: ZodTypeAny): boolean {
  if (!schema) {
    return false;
  }

  const unwrapped = unwrapSchema(schema);
  const current = unwrapped.schema;

  if (current instanceof ZodFile) {
    return true;
  }

  if (current instanceof ZodArray) {
    return hasFileSchema(current.element as unknown as ZodTypeAny);
  }

  if (current instanceof ZodObject) {
    return Object.values(current.shape).some((child) => hasFileSchema(child));
  }

  return false;
}

export function zodToOpenApiSchema(schema: ZodTypeAny): OpenApiSchema {
  const unwrapped = unwrapSchema(schema);
  const current = unwrapped.schema;

  if (current instanceof ZodObject) {
    const properties: Record<string, OpenApiSchema> = {};
    const required: string[] = [];

    for (const [key, childSchema] of Object.entries(current.shape)) {
      const childUnwrapped = unwrapSchema(childSchema as ZodTypeAny);
      properties[key] = zodToOpenApiSchema(childSchema as ZodTypeAny);

      if (!childUnwrapped.optional) {
        required.push(key);
      }
    }

    return withMeta(
      {
        type: 'object',
        properties,
        required: required.length ? required : undefined,
      },
      unwrapped
    );
  }

  if (current instanceof ZodArray) {
    return withMeta(
      {
        type: 'array',
        items: zodToOpenApiSchema(current.element as unknown as ZodTypeAny),
      },
      unwrapped
    );
  }

  if (current instanceof ZodEnum) {
    return withMeta(
      {
        type: 'string',
        enum: current.options,
      },
      unwrapped
    );
  }

  if (current instanceof ZodLiteral) {
    return withMeta(
      {
        type: typeof current.value,
        enum: [current.value as string | number],
      },
      unwrapped
    );
  }

  if (current instanceof ZodFile) {
    return withMeta(
      {
        type: 'string',
        format: 'binary',
      },
      unwrapped
    );
  }

  return withMeta(
    {
      type: baseSchemaType(current),
    },
    unwrapped
  );
}

export function getSchemaParameterDefinitions(
  schema: ZodTypeAny | undefined,
  location: 'path' | 'query'
): OpenApiParameter[] {
  if (!schema) {
    return [];
  }

  const unwrapped = unwrapSchema(schema);
  const current = unwrapped.schema;

  if (!(current instanceof ZodObject)) {
    return [];
  }

  return Object.entries(current.shape).map(([key, childSchema]) => {
    const childUnwrapped = unwrapSchema(childSchema as ZodTypeAny);
    return {
      name: key,
      in: location,
      required: location === 'path' ? true : !childUnwrapped.optional,
      schema: {
        type: baseSchemaType(childUnwrapped.schema),
      },
    };
  });
}
