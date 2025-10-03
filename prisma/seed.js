const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // 1️⃣ Create Brands
    const brands = await prisma.brand.createMany({
        data: [
            { name: "Apple" },
            { name: "Samsung" },
            { name: "Sony" },
            { name: "Nike" },
            { name: "Adidas" },
        ],
        skipDuplicates: true,
    });

    // 2️⃣ Create Categories
    const categories = await prisma.category.createMany({
        data: [
            { name: "Electronics" },
            { name: "Footwear" },
            { name: "Clothing" },
        ],
        skipDuplicates: true,
    });

    // Fetch created brands and categories (to use their IDs)
    const allBrands = await prisma.brand.findMany();
    const allCategories = await prisma.category.findMany();

    // Helper function
    const getId = (arr, name) => {
        const found = arr.find((x) => x.name === name);
        if (!found) {
            throw new Error(`Could not find id for name: ${name}`);
        }
        return found.id;
    };

    // 3️⃣ Create Products
    await prisma.products.createMany({
        data: [
            {
                name: "iPhone 15",
                description: "Latest Apple iPhone with A17 Bionic chip",
                price: "999",
                brandId: getId(allBrands, "Apple"),
                categoryId: getId(allCategories, "Electronics"),
            },
            {
                name: "Samsung Galaxy S24",
                description: "Flagship Samsung phone with Snapdragon Gen 3",
                price: "899",
                brandId: getId(allBrands, "Samsung"),
                categoryId: getId(allCategories, "Electronics"),
            },
            {
                name: "Sony WH-1000XM5",
                description: "Noise cancelling headphones",
                price: "399",
                brandId: getId(allBrands, "Sony"),
                categoryId: getId(allCategories, "Electronics"),
            },
            {
                name: "Nike Air Max",
                description: "Comfortable running shoes",
                price: "199",
                brandId: getId(allBrands, "Nike"),
                categoryId: getId(allCategories, "Footwear"),
            },
            {
                name: "Adidas Ultraboost",
                description: "Stylish sports shoes",
                price: "180",
                brandId: getId(allBrands, "Adidas"),
                categoryId: getId(allCategories, "Footwear"),
            },
        ],
        skipDuplicates: true,
    });

    console.log("✅ Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
