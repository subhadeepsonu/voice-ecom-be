import { prisma } from "../db";
export async function getProduct(name?: string, categoryId?: string, brandId?: string) {
    try {
        const resp = await prisma.products.findMany({
            where: {
                ...(categoryId && { categoryId }),
                ...(brandId && { brandId }),
                ...(name && { name: { contains: name, mode: "insensitive" } }),
            },
            include: {
                category: true,
                brand: true
            }
        });

        if (resp.length === 0) {
            return "No products found with current filters, please change them";
        }

        return resp;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Something went wrong while fetching products");
    }
}


export async function getProductById(id: string) {
    try {
        const resp = await prisma.products.findUnique({
            where: {
                id
            }
        })
        return resp
    } catch (error) {
        return "no product found"
    }
}

export async function getBrands() {
    try {
        const resp = await prisma.brand.findMany()
        return resp
    } catch (error) {
        return "no brands"
    }
}
export async function getCatgory() {
    try {
        const resp = await prisma.category.findMany()
        return resp
    } catch (error) {
        return "no category"
    }
}

export async function getBrandId(id: string) {
    try {
        const resp = await prisma.brand.findUnique({
            where: {
                id
            }
        })
        return resp
    } catch (error) {
        return "no brand found"
    }
}
export async function getCategoryId(id: string) {
    try {
        const resp = await prisma.category.findMany({
            where: {
                id
            }
        })
        return resp
    } catch (error) {
        return "no category found"
    }
}