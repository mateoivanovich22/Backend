import { fakerES as faker} from "@faker-js/faker";


export const generateProducts = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        code: faker.string.alphanumeric(10),
        price: faker.commerce.price(),
        stock: faker.string.numeric(5),
        status: faker.datatype.boolean(),
        category: faker.commerce.department(),
    }
}