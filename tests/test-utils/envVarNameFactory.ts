import { faker } from '@faker-js/faker';

export default function envVarNameFactory(): string {
  const slug = faker.lorem.slug({ min: 1, max: 5 });
  return slug.replaceAll('-', '_').toUpperCase();
}
