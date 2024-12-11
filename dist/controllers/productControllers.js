"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProduct = addProduct;
exports.removeProduct = removeProduct;
exports.findProduct = findProduct;
exports.getAllProducts = getAllProducts;
exports.updateProduct = updateProduct;
const authControllers_1 = require("./authControllers");
async function getAllProducts(req, res) {
    try {
        const products = await authControllers_1.Prisma.products.findMany();
        if (products) {
            res.status(200).json(products);
        }
    }
    catch (error) {
        console.log(error);
        res.status(501).json(error.stack);
    }
}
async function findProduct(req, res) {
    const productID = String(req.query.product);
    try {
        const product = await authControllers_1.Prisma.products.findUnique({
            where: { id: productID },
        });
        if (!product) {
            res.status(404).json({ error: "product does not exist, not available!" });
        }
        else {
            res.status(200).json(product);
        }
    }
    catch (error) {
        console.log(error);
        res.status(501).json({ error: error.stack });
    }
}
async function updateProduct(req, res) {
    const { id } = req.params;
    const { name, price, desc, isNew } = req.body;
    try {
        const updatedProduct = await authControllers_1.Prisma.products.update({
            where: { id },
            data: {
                name,
                price,
                desc,
                isNew,
            },
        });
        if (updatedProduct) {
            res.status(200).json({
                message: "product data updated succesfully",
                product: updatedProduct,
            });
        }
        else
            res
                .status(500)
                .json({ error: "unable to update product, something went wrong" });
        console.log();
    }
    catch (error) {
        console.log(error.stack);
        res
            .status(501)
            .json({ error: "something went wrong, internal server error" });
    }
}
async function addProduct(req, res) {
    const { name, price } = req.body;
    try {
        const newProduct = await authControllers_1.Prisma.products.create({
            data: {
                name,
                price,
            },
        });
        if (newProduct) {
            res.status(201).json({
                message: "new product added succesfully",
                product: newProduct,
            });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(501).json({ error: error.stack });
    }
}
async function removeProduct(req, res) {
    const productID = String(req.query.product);
    try {
        const itemToDelete = await authControllers_1.Prisma.products.delete({
            where: {
                id: productID,
            },
        });
        if (itemToDelete) {
            res.status(200).json({
                message: "item deleted succesfully!",
            });
            return;
        }
        res.status(400).json({ error: "something went wrong" });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "internal server error" });
        return;
    }
}
//# sourceMappingURL=productControllers.js.map