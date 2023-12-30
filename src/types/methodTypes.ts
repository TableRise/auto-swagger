export interface methodTypes {
  tags: string[];
  description?: string;
  responses: {
    [entityName: number]: {
      description: string;
      content?: contentTypes;
    };
  };
  security?: {
    bearerAuth: [];
  }[];
  parameters?: {
    name: string;
    in: string;
    required: boolean;
    schema: {
      type: string;
    };
  }[];
  requestBody?: {
    content?: contentTypes;
  };
  consumes?: string[];
}

export type schemaProperties = {
  [entityName: string]: {
    example: string;
  };
}[];

interface contentTypes {
  ['application/json']: {
    schema: {
      type: string;
      properties: schemaProperties
    };
  };
}
